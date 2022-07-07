import React from "react";
import Modal from "react-modal";
//@ts-ignore
import styles from "./Dialog.module.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export default (props: {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  text?: string;
  positiveButtonTitle?: string;
  negativeButtonTitle?: string;
  onPositiveButtonClicked?: () => void;
  onNegativeButtonClicked?: () => void;
  onAfterClose?: () => void;
  children?: JSX.Element;
}) => {
  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onClose}
      style={customStyles}
      contentLabel={props.title}
      onAfterClose={props.onAfterClose}
    >
      <div className={styles.wrapper}>
        <div className={styles.title}> {props.title} </div>
        <div className={styles.content}>
          {props.text}
          <div>{props.children}</div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.item}>
            <button
              className={styles.button}
              onClick={props.onNegativeButtonClicked}
            >
              {props.negativeButtonTitle || "НЕТ"}
            </button>
          </div>
          <div className={styles.item}>
            <button
              className={styles.button}
              onClick={props.onPositiveButtonClicked}
            >
              {props.positiveButtonTitle || "ДА"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
