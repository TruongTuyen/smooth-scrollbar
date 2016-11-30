import {
    getPrivateProp,
    setPrivateProp,
} from '../namespace/';

import {
    getPointerOffset,
} from '../metrics/';

import {
    setMovement,
} from '../movement/';

import { addEvent } from '../utils/';

/**
 * Drag events handler
 * @private
 */
export function handleDragEvents() {
    const {
        container,
    } = this::getPrivateProp('targets');

    let isDraging = false;
    let animation, padding;

    this::setPrivateProp({
        get isDraging() {
            return isDraging;
        },
    });

    const scroll = ({ x, y }) => {
        if (!x && !y) return;

        const { speed } = this::getPrivateProp('options');

        this::setMovement(x * speed, y * speed);

        animation = requestAnimationFrame(() => {
            scroll({ x, y });
        });
    };

    this::addEvent(container, 'dragstart', (evt) => {
        isDraging = true;
        padding = evt.target.clientHeight;

        cancelAnimationFrame(animation);
    });

    this::addEvent(document, 'dragover mousemove touchmove', (evt) => {
        if (!isDraging) return;
        cancelAnimationFrame(animation);
        evt.preventDefault();

        const dir = this::getPointerOffset(evt, padding);

        scroll(dir);
    });

    this::addEvent(document, 'dragend mouseup touchend blur', () => {
        cancelAnimationFrame(animation);
        isDraging = false;
    });
};