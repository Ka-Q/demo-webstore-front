import React, { useCallback, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import "./multiRangeSlider.css";

const MultiRangeSlider = ({ min, max, onChange, initialMin, initialMax, disabledVal }) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef(null);

  const [isMounted, setIsMounted] = useState(false);

  const disabled = disabledVal;

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // Get min and max values when their state changes
  useEffect(() => {
    if (isMounted) {
      onChange({ min: minVal, max: maxVal });
    } else {
      setIsMounted(true);
    }
  }, [minVal, maxVal, onChange]);

  // Initialize slider handles
  useEffect(() => {
    console.log("in useEffect: " + initialMin + ", " + initialMax);
    if (initialMin) {
      setMinVal(initialMin);
      minValRef.current = initialMin;
    }
    if (initialMax) {
      setMaxVal(initialMax);
      maxValRef.current = initialMax;
    }
  }, [initialMin, initialMax]);

  return (
    <div className="slider-container">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), Number(maxVal) - 1);
          setMinVal(value);
          minValRef.current = value;
        }}
        className="thumb thumb--left"
        style={{ zIndex: minVal > max - 100 && "5" }}
        disabled={disabled}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), Number(minVal) + 1);
          setMaxVal(value);
          maxValRef.current = value;
        }}
        className="thumb thumb--right"
        disabled={disabled}
      />

      <div className="slider">
        <div className="slider__track" />
        <div ref={range} className={disabled? "slider__range-disabled": "slider__range"} />
        <input
          type="number"
          value={minVal}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), min);
            if (value > maxVal) {
              setMaxVal(value);
              maxValRef.current = value;
            }
            setMinVal(event.target.value);
            minValRef.current = event.target.value;
          }}
          disabled={disabled}
          className="slider__left-value"
        />
        <input
          type="number"
          value={maxVal}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), max);
            if (value < minVal) {
              setMinVal(value);
              minValRef.current = value;
            }
            setMaxVal(value);
            maxValRef.current = value;
          }}
          className="slider__right-value"
          disabled={disabled}
        />
      </div>
    </div>
);

};

MultiRangeSlider.propTypes = {
min: PropTypes.number.isRequired,
max: PropTypes.number.isRequired,
onChange: PropTypes.func.isRequired
};

export default MultiRangeSlider;
