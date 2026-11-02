/*
 * Window handling from KWin's former JavaScript Squash effect:
 * SPDX-FileCopyrightText: 2018 Vlad Zahorodnii <vlad.zahorodnii@kde.org>
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

"use strict";

const minimizeEffect = {
    duration: animationTime(250),

    loadConfig() {
        minimizeEffect.duration = animationTime(250);
    },

    // Where the window ends up, from the taskbar button.
    finalRect(window) {
        const button = window.iconGeometry;
        const frame = window.geometry;
        const width = button.width * 0.6;
        const height = width * frame.height / frame.width;
        return {
            x: button.x + width * 0.3,
            y: button.y - height,
            width,
            height,
        };
    },

    // Animations from the window to the final rectangle; `toButton` for
    // minimizing, else back. Size scales around the centre, so the
    // translation moves centre to centre.
    animations(window, toButton) {
        const frame = window.geometry;
        const end = minimizeEffect.finalRect(window);
        const full = {
            size: { value1: frame.width, value2: frame.height },
            offset: { value1: 0, value2: 0 },
            opacity: 0.85,
        };
        const small = {
            size: { value1: end.width, value2: end.height },
            offset: {
                value1: end.x + end.width / 2 - (frame.x + frame.width / 2),
                value2: end.y + end.height / 2 - (frame.y + frame.height / 2),
            },
            opacity: 0,
        };
        const from = toButton ? full : small;
        const to = toButton ? small : full;
        return [
            { type: Effect.Size, from: from.size, to: to.size },
            { type: Effect.Translation, from: from.offset, to: to.offset },
            { type: Effect.Opacity, from: from.opacity, to: to.opacity },
        ];
    },

    hasButton(window) {
        const button = window.iconGeometry;
        return button.width > 0 && button.height > 0 && window.geometry.width > 0;
    },

    slotWindowMinimized(window) {
        if (effects.hasActiveFullScreenEffect || !minimizeEffect.hasButton(window)) {
            return;
        }
        if (window.unminimizeAnimation) {
            if (redirect(window.unminimizeAnimation, Effect.Backward)) {
                return;
            }
            cancel(window.unminimizeAnimation);
            delete window.unminimizeAnimation;
        }
        if (window.minimizeAnimation) {
            if (redirect(window.minimizeAnimation, Effect.Forward)) {
                return;
            }
            cancel(window.minimizeAnimation);
        }
        window.minimizeAnimation = animate({
            window,
            curve: QEasingCurve.OutQuad,
            duration: minimizeEffect.duration,
            animations: minimizeEffect.animations(window, true),
        });
    },

    slotWindowUnminimized(window) {
        if (effects.hasActiveFullScreenEffect || !minimizeEffect.hasButton(window)) {
            return;
        }
        if (window.minimizeAnimation) {
            if (redirect(window.minimizeAnimation, Effect.Backward)) {
                return;
            }
            cancel(window.minimizeAnimation);
            delete window.minimizeAnimation;
        }
        if (window.unminimizeAnimation) {
            if (redirect(window.unminimizeAnimation, Effect.Forward)) {
                return;
            }
            cancel(window.unminimizeAnimation);
        }
        window.unminimizeAnimation = animate({
            window,
            curve: QEasingCurve.InQuad,
            duration: minimizeEffect.duration,
            animations: minimizeEffect.animations(window, false),
        });
    },

    slotWindowAdded(window) {
        window.minimizedChanged.connect(() => {
            if (window.minimized) {
                minimizeEffect.slotWindowMinimized(window);
            } else {
                minimizeEffect.slotWindowUnminimized(window);
            }
        });
    },

    init() {
        effect.configChanged.connect(minimizeEffect.loadConfig);
        effects.windowAdded.connect(minimizeEffect.slotWindowAdded);
        for (const window of effects.stackingOrder) {
            minimizeEffect.slotWindowAdded(window);
        }
    },
};

minimizeEffect.init();
