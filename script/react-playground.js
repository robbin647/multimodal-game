var _jsxFileName = "jsx\\react-playground.js",
    _this3 = this;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ButtonLike = function (_React$Component) {
    _inherits(ButtonLike, _React$Component);

    function ButtonLike(props) {
        _classCallCheck(this, ButtonLike);

        var _this = _possibleConstructorReturn(this, (ButtonLike.__proto__ || Object.getPrototypeOf(ButtonLike)).call(this, props));

        _this.state = { liked: false };
        return _this;
    }

    _createClass(ButtonLike, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            if (this.state.liked) {
                return 'You liked this';
            }

            var btn = React.createElement(
                React.Fragment,
                {
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 14
                    },
                    __self: this
                },
                React.createElement(
                    "button",
                    { onClick: function onClick() {
                            return _this2.setState({ liked: true });
                        }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 15
                        },
                        __self: this
                    },
                    "Like"
                )
            );

            return btn;
        }
    }]);

    return ButtonLike;
}(React.Component);

var react_playground = document.querySelector("#react-playground");
ReactDOM.render(React.createElement(ButtonLike, {
    __source: {
        fileName: _jsxFileName,
        lineNumber: 26
    },
    __self: this
}), react_playground, function () {
    console.log("Rendered component:");
    console.log(React.createElement(ButtonLike, {
        __source: {
            fileName: _jsxFileName,
            lineNumber: 30
        },
        __self: _this3
    }));
});