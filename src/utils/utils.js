import _ from 'lodash';
import { 
    ARRAY_SIZE_BY_TYPE, 
    FIELDS_BY_INDEX,
    PARSE_INT, 
    TO_UPPER_CASE,
    PASTE_SYMBOL,
    TYPE_NONE,
    TYPE_LINE,
    TYPE_RECT,
    TYPE_FILL,
    TYPE_CREATE,
} from '../constants';

export const minMax = (value0, value1) => {
    if (value0 === value1) {
        return {
            min: value0,
            max: value1,
        }
    }
    return {
        min: _.min([value0, value1]),
        max: _.max([value0, value1]),
    }
};

export const range = (start, end, step = 1) => 
    _.range(start, end, step);

export const isOutBounds = (x, y, width, height) => {
    if (
        x < 1 || 
        x > width || 
        y < 1 || 
        y > height
    ) {
        return true;
    }
    return false;
};

export const getCellId = (x, y, canvas) => {
    const { width, height } = canvas;
    if (isOutBounds(x, y, width, height)) {
        return '';
    }
    return `${x + ((y - 1) * width)}`;
};

export const getCell = (id) => {
    const result = document.getElementById(id);
    if (result) {
        return result;
    }
    return false;
};

export const matchReplaceColor = (cellId, replaceColor) => {
    const cell = getCell(cellId);
    if (cell && cell.innerHTML === replaceColor) {
        return true;
    }
    return false;
};

export const saveFile = (data, filename, type) => {
    const a = document.createElement("a");
    const file = new Blob([data], {type: type});
    const url =  URL.createObjectURL(file);

    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);  
    }, 0); 
};

export const loadFile = () => {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        const file = document.querySelector('input[type=file]').files[0];
        const reader = new FileReader();
        const textFile = /text.*/;
        
        if (file.type.match(textFile)) {
            reader.onload = (event) => {
                document.getElementById('data-textarea').value = event.target.result;
            };
        }
        reader.readAsText(file);
    }
};

export const clearCanvas = (canvas, setContentToSave) => {
    range(1, canvas.width + 1).forEach(x => {
        range(1, canvas.height + 1).forEach(y => {
            const cell = getCell(getCellId(x, y, canvas));
            if (cell) {
                cell.innerHTML = "";
            }
        });
    });
    setContentToSave('');
};

export const parseFileToObject = (file) => {
    const commands = [];
    const lines = file.split('\n');
    const values = lines.map(value => {
        if (!value) {
            return null;
        }
        return value.trim().split(' ')
    }).filter(value => value);

    values.forEach(value => {
        const type = value[0].toUpperCase();
        if (value.length === ARRAY_SIZE_BY_TYPE[type]) {
            const command = {};
            value.forEach(() => FIELDS_BY_INDEX[type].forEach((name, index) => {
                let result = value[index];
                if (TO_UPPER_CASE.includes(name)) {
                    result = result.toUpperCase();
                }
                if (PARSE_INT.includes(name)) {
                    result = parseInt(result);
                }
                command[name] = result;
            }
            ));
            commands.push(command);
        }
    });
    return commands;
};

export const executeCommand = (data, canvas, setCanvas, setContentToSave) => {
    const isCanvasCreated = !!(canvas.width * canvas.height);

    const { 
        start_x: startX, 
        start_y: startY, 
        end_x: endX, 
        end_y: endY,
        type,
        color, 
    } = data;

    if (
        !type || 
        type === TYPE_NONE || 
        (!isCanvasCreated && type !== TYPE_CREATE)
    ) {
        return;
    }

    const rangeX = minMax(startX, endX);
    const rangeY = minMax(startY, endY);

    if (type === TYPE_CREATE) {
        canvas = createCanvas(data, canvas, setCanvas, setContentToSave);
    } else if (type === TYPE_LINE) {
        drawLine(canvas, rangeX, rangeY, startY, endX);
    } else if (type === TYPE_RECT) {
        drawRect(canvas, rangeX, rangeY, startX, startY, endX, endY);
    } else if (type === TYPE_FILL) {
        fillArea(color, canvas, startX, startY);
    }
    updateSaveData(canvas, setContentToSave);
    return canvas;
};

export const createCanvas = (data, canvas, setCanvas, setContentToSave) => {
    clearCanvas(canvas, setContentToSave);
    canvas = {
        width: data.width,
        height: data.height,
    };
    setCanvas(canvas);
    return canvas;
};

export const drawLine = (canvas, rangeX, rangeY, startY, endX) => {
    range(rangeX.min, rangeX.max + 1).forEach(x => {
        const cellX = getCell(getCellId(x, startY, canvas));
        if (cellX) {
            cellX.innerHTML = PASTE_SYMBOL;
        }
    });
    range(rangeY.min, rangeY.max + 1).forEach(y => {
        const cellY = getCell(getCellId(endX, y, canvas));
        if (cellY) {
            cellY.innerHTML = PASTE_SYMBOL;
        }
    });
};

export const drawRect = (canvas, rangeX, rangeY, startX, startY, endX, endY) => {
    range(rangeX.min, rangeX.max).forEach(x => {
        [startY, endY].forEach(y => {
            const cellX = getCell(getCellId(x, y, canvas));
            if (cellX) {
                cellX.innerHTML = PASTE_SYMBOL;
            }
        })
        range(rangeY.min, rangeY.max + 1).forEach(y => {
            [startX, endX].forEach(x => {
                if (x > canvas.width) {
                    return;
                }
                const cellY = getCell(getCellId(x, y, canvas));
                if (cellY) {
                    cellY.innerHTML = PASTE_SYMBOL;
                }
            })
        });
    });
};

export const fillArea = (color, canvas, startX, startY) => {
    const { width, height } = canvas;
    if (isOutBounds(startX, startY, width, height)) {
        return;
    }

    const cell = getCell(getCellId(startX, startY, canvas));
    if (cell) {
        const replaceColor = cell.innerHTML;

        const pixelStack = [{ 
            x: startX, 
            y: startY 
        }];
        let newPos = [];
        let cellX = startX;
        let cellY = startY;
        let cellPos = getCellId(cellX, cellY, canvas);
        let isReachLeft = false;
        let isReachRight = false;

        while(pixelStack.length) {
            newPos = pixelStack.pop();
            cellX = newPos.x;
            cellY = newPos.y;
            cellPos = getCellId(cellX, cellY, canvas);

            while (cellY > 0 && matchReplaceColor(cellPos, replaceColor)) {
                cellY -= 1;
                cellPos -= width;
            }

            cellPos += width;
            cellY += 1;
            isReachLeft = false;
            isReachRight = false;

            while (cellY <= height && matchReplaceColor(cellPos, replaceColor)) {
                cellY += 1;

                const fillCell = getCell(cellPos);
                fillCell.innerHTML = color;

                if (cellX > 0) {
                    if (matchReplaceColor(cellPos - 1, replaceColor)) {
                        if (!isReachLeft) {
                            if (cellX > 1) {
                                pixelStack.push({ 
                                    x: cellX - 1, 
                                    y: cellY - 1 
                                });
                            }
                            isReachLeft = true;
                        }
                    } else if (isReachLeft) {
                        isReachLeft = false;
                    }
                }
                if (cellX <= width) {
                    if (matchReplaceColor(cellPos + 1, replaceColor)) {
                        if (!isReachRight) {
                            if (cellX + 1 <= width) {
                                pixelStack.push({ 
                                    x: cellX + 1, 
                                    y: cellY - 1 
                                });
                            }
                            isReachRight = true;
                        }
                    } else if (isReachRight) {
                        isReachRight = false;
                    }
                }
                cellPos += width;
            }
        }
    }
};

export const updateSaveData = (canvas, setContentToSave) => {
    const { width, height } = canvas;
    let result = '';
    range(0, height + 2).forEach(y => {
        range(0, width + 2).forEach(x => {
            if (
                ((y === 0 || y === height + 1) &&
                (x === 0 || x === width + 1)) || 
                (y === 0 || y === height + 1)
            ) {
                result += '-';
            } else if (x === 0 || x === width + 1) {
                result += '|';
            } else {
                const cell = getCell(getCellId(x, y, canvas));
                if (cell) {
                    result += cell.innerHTML ? cell.innerHTML : ' ';
                }
            }
            if (x === width + 1) {
                result += '\n';
            }
            
        });
    });
    result += '\n';
    setContentToSave(prevState => prevState + result);
};