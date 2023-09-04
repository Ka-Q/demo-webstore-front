import React, { useCallback, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import "./multiRangeSlider.css";

const MultiRangeSlider = ({ min, max, onChange, disabledVal}) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef(null);

  const disabled = disabledVal;

  console.log("disabled:" + disabled);

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
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  return (
    <div className="slider-container">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - 1);
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
          const value = Math.max(Number(event.target.value), minVal + 1);
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
                    setMinVal(value);
                    minValRef.current = value;
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
