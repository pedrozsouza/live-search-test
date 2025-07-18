import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

jest.useFakeTimers();

describe("useDebounce", () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("teste", 300));

    expect(result.current).toBe("teste");
  });

  it("should debounce value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "inicial", delay: 300 },
      }
    );

    expect(result.current).toBe("inicial");

    rerender({ value: "mudança", delay: 300 });

    expect(result.current).toBe("inicial");

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe("mudança");
  });
}); 