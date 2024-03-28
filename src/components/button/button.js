import "../Home/Home.css";

const Button = ({ ButtonText, className, onClick, isDisabled }) => {
    return (
        <button disabled={isDisabled} style={{ all: "unset" }}>
            <div
                className={`${className} ${isDisabled ? "disabled-button-style" : "standard-btn"
                    }`}
                onClick={onClick}
            >
                {ButtonText}
            </div>
        </button>
    );
};
export default Button;