import "./index.css";
import { btns, BTN_ACTIONS } from "./btnConfig";
import React, { useState, useRef, useEffect } from "react";

const Calculator = () => {
  const [calcDisplay, setCalcDisplay] = useState("");
  const [result, setResult] = useState("");
  const [equal, setEqual] = useState(false);

  const btnsRef = useRef(null);

  useEffect(() => {
    btnsRef.current.focus();
  }, []);

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

  const count = (val) => {
    let temp = val.replace(/x/g, "*").replace(/%/g, "/100").replace(/=/g, "");
    // console.log("🚀 ~ file: index.js ~ line 11 ~ count ~ temp", temp);
    let last = temp[temp.length - 1];
    // console.log("🚀 ~ file: index.js ~ line 13 ~ count ~ last", last);
    if (last === "*" || last === "/" || last === "+" || last === "-") {
      return temp.length > 1
        ? `=${eval(temp.substring(0, temp.length - 1))}`
        : "";
    } else {
      return temp.length > 1 ? `=${eval(temp)}` : "";
    }
  };

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
    // console.log("key", e.key);
    actionBtn(btn[0]);
  };

  const actionBtn = (val) => {
    if (
      val?.action === BTN_ACTIONS.ADD &&
      equal === false &&
      calcDisplay.length < 17
    ) {
      let display = `${calcDisplay}${val?.display}`;
      if (val.display === "%") {
        display = display.replace(
          new RegExp(`${getNumberFrontPercent(calcDisplay)}%`, "g"),
          `${eval(`${getNumberFrontPercent(calcDisplay)} / 100`)}`
        );
      }
      // console.log(display);
      if (
        display[0] === "x" ||
        display[0] === "/" ||
        display[0] === "+" ||
        display[0] === "-" ||
        display[0] === "%" ||
        display[0] === "="
      ) {
      } else {
        setResult(count(`${calcDisplay}${val?.display}`));
        setCalcDisplay(display);
      }
    }
    if (val?.action === BTN_ACTIONS.DELETE) {
      setCalcDisplay(calcDisplay.substring(0, calcDisplay.length - 1));
      setResult(
        calcDisplay.length > 1
          ? count(calcDisplay.substring(0, calcDisplay.length - 1))
          : ""
      );
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
            ? result.length > 12
              ? Number(result.replace(/=/g, "")).toExponential(7)
              : result.replace(/=/g, "")
            : ""}
        </h2>
      </div>
      <div
        className="calculator__main"
        tabIndex={0}
        onKeyDown={(e) => handleKeyPress(e)}
        ref={btnsRef}
      >
        <div className="result__container">
          <span
            className={`main__result ${equal ? "main__result__equal" : ""}`}
          >
            {calcDisplay}
          </span>
          <span className={`sub__result ${equal ? "sub__result__equal" : ""}`}>
            {result.length > 12
              ? `=${Number(result.replace(/=/g, "")).toExponential(7)}`
              : result}
          </span>
        </div>
        <div className="button__container">
          {btns.map((item, index) => {
            return (
              <div
                className="button__row"
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
