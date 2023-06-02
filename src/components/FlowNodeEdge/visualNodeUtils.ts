import { useCallback } from 'react';
import { NodeOrigin, XYPosition, Rect, NodeInternals, Transform, ReactFlowState, useStore, Node } from 'reactflow';

export const getOverlappingArea = (rectA: Rect, rectB: Rect): number => {
    const xOverlap = Math.max(0, Math.min(rectA.x + rectA.width, rectB.x + rectB.width) - Math.max(rectA.x, rectB.x));
    const yOverlap = Math.max(0, Math.min(rectA.y + rectA.height, rectB.y + rectB.height) - Math.max(rectA.y, rectB.y));

    return Math.ceil(xOverlap * yOverlap);
};

export const getNodePositionWithOrigin = (
    node: Node | undefined,
    nodeOrigin: NodeOrigin = [0, 0]
): XYPosition & { positionAbsolute: XYPosition } => {
    if (!node) {
        return {
            x: 0,
            y: 0,
            positionAbsolute: {
                x: 0,
                y: 0,
            },
        };
    }

    const offsetX = (node.width ?? 0) * nodeOrigin[0];
    const offsetY = (node.height ?? 0) * nodeOrigin[1];

    const position: XYPosition = {
        x: node.position.x - offsetX,
        y: node.position.y - offsetY,
    };

    return {
        ...position,
        positionAbsolute: node.positionAbsolute
            ? {
                x: node.positionAbsolute.x - offsetX,
                y: node.positionAbsolute.y - offsetY,
            }
            : position,
    };
};

export const getNodesInside = (
    nodeInternals: NodeInternals,
    rect: Rect,
    [tx, ty, tScale]: Transform = [0, 0, 1],
    partially = false,
    // set excludeNonSelectableNodes if you want to pay attention to the nodes "selectable" attribute
    excludeNonSelectableNodes = false,
    nodeOrigin: NodeOrigin = [0, 0]
): Node[] => {
    const paneRect = {
        x: (rect.x - tx) / tScale,
        y: (rect.y - ty) / tScale,
        width: rect.width / tScale,
        height: rect.height / tScale,
    };

    const visibleNodes: Node[] = [];

    nodeInternals.forEach((node) => {
        const { width, height, selectable = true, hidden = false } = node;

        if ((excludeNonSelectableNodes && !selectable) || hidden) {
            return false;
        }

        const { positionAbsolute } = getNodePositionWithOrigin(node, nodeOrigin);

        const nodeRect = {
            x: positionAbsolute.x,
            y: positionAbsolute.y,
            width: width || 0,
            height: height || 0,
        };
        const overlappingArea = getOverlappingArea(paneRect, nodeRect);
        const notInitialized =
            typeof width === 'undefined' || typeof height === 'undefined' || width === null || height === null;

        const partiallyVisible = partially && overlappingArea > 0;
        const area = (width || 0) * (height || 0);
        const isVisible = notInitialized || partiallyVisible || overlappingArea >= area;

        if (isVisible || node.dragging) {
            visibleNodes.push(node);
        }
    });

    return visibleNodes;
};

export function useVisibleNodes(onlyRenderVisible: boolean) {
    const nodes = useStore(
        useCallback(
            (s: ReactFlowState) =>
                onlyRenderVisible
                    ? getNodesInside(s.nodeInternals, { x: 0, y: 0, width: s.width, height: s.height }, s.transform, true)
                    : s.getNodes(),
            [onlyRenderVisible]
        )
    );

    return nodes;
}