export const GRID_SIZE = 32;

export const PASTE_SYMBOL = 'X';

export const TYPE_NONE = 'NONE';
export const TYPE_CREATE = 'C';
export const TYPE_LINE = 'L';
export const TYPE_RECT = 'R';
export const TYPE_FILL = 'B';

export const ARRAY_SIZE_BY_TYPE = {
    [TYPE_CREATE]: 3,
    [TYPE_LINE]: 5,
    [TYPE_RECT]: 5,
    [TYPE_FILL]: 4,
}

const TYPE_FIELD = 'type';
const WIDTH_FIELD = 'width';
const HEIGHT_FIELD = 'height';
const COLOR_FIELD = 'color';
const START_X_FIELD = 'start_x';
const START_Y_FIELD = 'start_y';
const END_X_FIELD = 'end_x';
const END_Y_FIELD = 'end_y';

export const FIELDS_BY_INDEX = {
    [TYPE_CREATE]: [
        TYPE_FIELD, 
        WIDTH_FIELD, 
        HEIGHT_FIELD
    ],
    [TYPE_LINE]: [
        TYPE_FIELD, 
        START_X_FIELD, 
        START_Y_FIELD, 
        END_X_FIELD, 
        END_Y_FIELD
    ],
    [TYPE_RECT]: [
        TYPE_FIELD, 
        START_X_FIELD, 
        START_Y_FIELD, 
        END_X_FIELD, 
        END_Y_FIELD
    ],
    [TYPE_FILL]: [
        TYPE_FIELD, 
        START_X_FIELD, 
        START_Y_FIELD, 
        COLOR_FIELD
    ],
}

export const PARSE_INT = [
    WIDTH_FIELD,
    HEIGHT_FIELD,
    START_X_FIELD, 
    START_Y_FIELD, 
    END_X_FIELD, 
    END_Y_FIELD, 
];

export const TO_UPPER_CASE = [
    TYPE_FIELD,  
];