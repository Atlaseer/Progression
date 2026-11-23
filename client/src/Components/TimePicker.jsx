import { useRef, useEffect } from 'react';

const ITEM_H = 40;
const PADDING = 2;

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

function ScrollColumn({ items, value, onChange }) {
  const ref = useRef(null);
  // Tracks when scrollTop is set by code (not the user dragging/swiping)
  const programmatic = useRef(false);
  // Stable ref to onChange so effects don't need it as a dependency
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Sync scroll position when value changes from outside
  useEffect(() => {
    const idx = items.indexOf(value);
    if (ref.current && idx >= 0) {
      programmatic.current = true;
      ref.current.scrollTop = idx * ITEM_H;
    }
  }, [value, items]);

  // Non-passive wheel listener: move exactly one step per tick
  useEffect(() => {
    const el = ref.current;
    const handleWheel = (e) => {
      e.preventDefault();
      const idx = Math.round(el.scrollTop / ITEM_H);
      const dir = e.deltaY > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(items.length - 1, idx + dir));
      programmatic.current = true;
      el.scrollTop = next * ITEM_H;
      onChangeRef.current(items[next]);
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [items]);

  // Touch/trackpad scroll: snap to nearest item on settle
  const handleScroll = () => {
    if (programmatic.current) {
      programmatic.current = false;
      return;
    }
    clearTimeout(ref.current._snap);
    ref.current._snap = setTimeout(() => {
      const idx = Math.round(ref.current.scrollTop / ITEM_H);
      const clamped = Math.max(0, Math.min(items.length - 1, idx));
      programmatic.current = true;
      ref.current.scrollTop = clamped * ITEM_H;
      onChangeRef.current(items[clamped]);
    }, 150);
  };

  const scrollToItem = (item) => {
    const idx = items.indexOf(item);
    if (idx < 0 || !ref.current) return;
    programmatic.current = true;
    ref.current.scrollTop = idx * ITEM_H;
    onChangeRef.current(item);
  };

  const padded = [
    ...Array(PADDING).fill(null),
    ...items,
    ...Array(PADDING).fill(null),
  ];

  return (
    <div className="tp-col" ref={ref} onScroll={handleScroll}>
      {padded.map((item, i) => (
        <div
          key={i}
          className={`tp-item${item === value ? ' tp-item--selected' : ''}`}
          onClick={() => item !== null && scrollToItem(item)}
        >
          {item ?? ''}
        </div>
      ))}
    </div>
  );
}

export function TimePicker({ value, onChange }) {
  const [h = '08', m = '00'] = value ? value.split(':') : [];

  return (
    <div className="tp-wrapper">
      <div className="tp-highlight" />
      <ScrollColumn items={hours} value={h} onChange={(hh) => onChange(`${hh}:${m}`)} />
      <div className="tp-sep">:</div>
      <ScrollColumn items={minutes} value={m} onChange={(mm) => onChange(`${h}:${mm}`)} />
    </div>
  );
}
