import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { useFrame, useThree, type ThreeElements } from '@react-three/fiber';
import { Group, Vector3 } from 'three';

type Props = Omit<ThreeElements['group'], 'children'> & {
  children: ReactNode;
  center?: boolean;
  fullscreen?: boolean;
  style?: CSSProperties;
  zIndexRange?: [number, number];
};

/** Screen-space overlays with deferred DOM-root teardown for React 19. */
export function SceneHtml({ children, center, fullscreen, style, zIndexRange = [8, 0], ...props }: Props) {
  const { gl } = useThree();
  const group = useRef<Group>(null);
  const host = useRef<HTMLDivElement | null>(null);
  const root = useRef<Root | null>(null);
  const point = useRef(new Vector3());

  useEffect(() => {
    const container = document.createElement('div');
    Object.assign(container.style, { position: 'absolute', top: '0', left: '0' });
    gl.domElement.parentElement?.appendChild(container);
    const mountedRoot = createRoot(container);
    host.current = container;
    root.current = mountedRoot;
    return () => {
      container.style.display = 'none';
      if (host.current === container) { host.current = null; root.current = null; }
      // Finish the parent commit before unmounting a separate DOM reconciler.
      queueMicrotask(() => { mountedRoot.unmount(); container.remove(); });
    };
  }, [gl]);

  useEffect(() => {
    root.current?.render(<div style={{ ...style, transform: !fullscreen && center ? 'translate(-50%,-50%)' : undefined, width: fullscreen ? '100%' : undefined, height: fullscreen ? '100%' : undefined }}>{children}</div>);
  }, [children, center, fullscreen, style, gl]);

  useFrame(({ camera, size }) => {
    if (!host.current || !group.current) return;
    group.current.updateWorldMatrix(true, false);
    point.current.setFromMatrixPosition(group.current.matrixWorld).project(camera);
    const el = host.current;
    el.style.pointerEvents = style?.pointerEvents ?? 'auto';
    el.style.zIndex = String(zIndexRange[0]);
    el.style.display = fullscreen || (point.current.z >= -1 && point.current.z <= 1) ? 'block' : 'none';
    el.style.width = fullscreen ? `${size.width}px` : '';
    el.style.height = fullscreen ? `${size.height}px` : '';
    el.style.transform = fullscreen ? '' : `translate(${(point.current.x + 1) * size.width / 2}px,${(1 - point.current.y) * size.height / 2}px)`;
  });
  return <group {...props} ref={group} />;
}
