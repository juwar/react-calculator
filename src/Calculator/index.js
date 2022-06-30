import "./index.css";
import { btns, BTN_ACTIONS } from "./btnConfig";
import React, { useState, useRef, useEffect } from "react";

const Calculator = () => {
  const [calcDisplay, setCalcDisplay] = useState("");
  const [result, setResult] = useState("");
  const [equal, setEqual] = useState(false);

  const btnsRef = useRef(null);
  const operator = ["x", "+", "/", "-", "%", "=", "*"];

  useEffect(() => {
    btnsRef.current.focus();
  }, []);

  //Get number value front of percent operator
  const getNumberFrontPercent = (value) => {
    const arrNum = [];
    for (let i = 0; i < value.length; i++) {
      if (
        value[i] === "x" ||
        value[i] === "/" ||
        value[i] === "+" ||
        value[i] === "-"
      ) {
        arrNum.push(value.indexOf(value[i]));
      }
    }
    const max = Math.max(...arrNum);
    return value?.substring(max + 1, value.length);
  };

  //Function to count entered number
  const count = (val) => {
    let temp = val.replace(/x/g, "*").replace(/%/g, "/100").replace(/=/g, "");
    let last = temp[temp.length - 1];
    let res = "";
    if (temp.length > 0) {
      res = operator.includes(last)
        ? `${eval(temp.substring(0, temp.length - 1))}`
        : `${eval(temp)}`;
    }
    return parseFloat(Number(res).toFixed(7));
  };

  //function to handle key press from keyboard input
  const handleKeyPress = (e) => {
    const key =
      e.key === "Backspace"
        ? "DEL"
        : e.key === "*"
        ? "x"
        : e.key === "Enter"
        ? "="
        : e.key;
    const btn = btns.filter((item) => item.display === key);
    actionBtn(btn[0]);
  };

  const actionBtn = (val) => {
    if (val?.action === BTN_ACTIONS.ADD && calcDisplay.length < 36) {
      let display = `${calcDisplay}${val?.display}`;

      // funtion to replace display with new input number when equal already tigered
      if (equal === true) {
        display = `${val?.display}`;
        setEqual(false);
      }

      //function to replace number in percent with result of percent
      if (val.display === "%" && display.length > 1) {
        display = display.replace(
          new RegExp(`${getNumberFrontPercent(calcDisplay)}%`, "g"),
          `${eval(`${getNumberFrontPercent(calcDisplay)} / 100`)}`
        );
      }

      if (
        //Check first input not a operator
        !operator.includes(display[0]) &&
        //Check last input after operator, not an operator too
        !(
          operator.includes(display[display.length - 1]) &&
          operator.includes(display[display.length - 2])
        )
      ) {
        setResult(count(display));
        setCalcDisplay(display);
      }
    }

    if (val?.action === BTN_ACTIONS.DELETE && equal === false) {
      let newData = calcDisplay.substring(0, calcDisplay.length - 1);
      setCalcDisplay(newData);
      setResult(calcDisplay.length > 1 ? count(newData) : "");
    }

    if (val?.action === BTN_ACTIONS.DELETE_ALL) {
      setCalcDisplay("");
      setResult("");
      setEqual(false);
    }

    if (val?.action === BTN_ACTIONS.CALC && equal === false) {
      setResult(count(calcDisplay));
      setEqual(true);
    }
  };

  return (
    <div className="Calculator">
      <div className="calculator__header">
        <h2>
          End Result :{" "}
          {equal
            ? result.toString().length > 12
              ? result.toExponential()
              : result
            : ""}
        </h2>
      </div>
      <div
        className="calculator__main"
        tabIndex={0}
        onKeyDown={(e) => handleKeyPress(e)}
        ref={btnsRef}
      >
        <div className="display__container">
          <span
            className={`main__display ${equal ? "main__display__equal" : ""}`}
          >
            {calcDisplay}
          </span>
          <span
            className={`sub__display ${equal ? "sub__display__equal" : ""}`}
          >
            {typeof result === "number" ? "=" : ""}
            {result.toString().length > 12 ? result.toExponential() : result}
          </span>
        </div>
        <div className="button__container disable__select">
          {btns.map((item, index) => {
            return (
              <div
                className={`button__row ${
                  item.class !== "" ? `${item.class}` : ""
                }`}
                key={index}
                onClick={() => actionBtn(item)}
              >
                {item.display}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
