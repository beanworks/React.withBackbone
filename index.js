'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.withBackbone = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _backbone = require('backbone');

var _backbone2 = _interopRequireDefault(_backbone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function getNonIntersectIn(setA, setB) {
    var presentOnlyInA = new Set(setA);
    var presentOnlyInB = new Set(setB);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = presentOnlyInB[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var elem = _step.value;

            if ([].concat(_toConsumableArray(presentOnlyInA)).indexOf(elem) !== -1) {
                presentOnlyInB.delete(elem);
                presentOnlyInA.delete(elem);
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return [presentOnlyInA, presentOnlyInB];
}

var withBackbone = function withBackbone(WrappedComponent) {
    var WithBackbone = function (_React$Component) {
        _inherits(WithBackbone, _React$Component);

        function WithBackbone(props) {
            _classCallCheck(this, WithBackbone);

            var _this = _possibleConstructorReturn(this, (WithBackbone.__proto__ || Object.getPrototypeOf(WithBackbone)).call(this, props));

            _this.modelListener = new Object();
            _lodash2.default.extend(_this.modelListener, _backbone2.default.Events);
            _this.setOfModels = _this.getSetOfBackbone(props, _backbone2.default.Model);
            _this.subscribeTo(_this.modelListener, _this.setOfModels, 'change');

            _this.collectionListener = new Object();
            _lodash2.default.extend(_this.collectionListener, _backbone2.default.Events);
            _this.setOfCollections = _this.getSetOfBackbone(props, _backbone2.default.Collection);
            _this.subscribeCollection(_this.collectionListener, _this.setOfCollections);

            _this.debouncedForceUpdate = _lodash2.default.debounce(_this.forceUpdateWrapper, 0);

            return _this;
        }

        _createClass(WithBackbone, [{
            key: 'forceUpdateWrapper',
            value: function forceUpdateWrapper() {
                //console.log('Force Updating ', getDisplayName(WrappedComponent));
                this.forceUpdate();
            }
        }, {
            key: 'getSetOfBackbone',
            value: function getSetOfBackbone(props, instance) {
                var result = new Set();
                for (var propName in props) {
                    if (this.props[propName] instanceof instance) {
                        result.add(this.props[propName]);
                    }
                }

                return result;
            }
        }, {
            key: 'subscribeCollection',
            value: function subscribeCollection(listener, setOfCollection) {
                this.subscribeTo(listener, setOfCollection, 'add remove reset sort');
            }
        }, {
            key: 'subscribeTo',
            value: function subscribeTo(listener, setOfObj) {
                var _this2 = this;

                var event = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'change';
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = setOfObj[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var obj = _step2.value;

                        listener.listenTo(obj, event, function () {
                            _this2.debouncedForceUpdate();
                        });
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }
        }, {
            key: 'unsubscribeFrom',
            value: function unsubscribeFrom(listener, setOfObj) {
                setOfObj.forEach(function (obj) {
                    listener.stopListening(obj);
                });
            }
        }, {
            key: 'componentWillReceiveProps',
            value: function componentWillReceiveProps(nextProps) {
                var newSetOfModels = this.getSetOfBackbone(nextProps, _backbone2.default.Model);
                var newSetOfCollections = this.getSetOfBackbone(nextProps, _backbone2.default.Collection);

                var _getNonIntersectIn = getNonIntersectIn(this.setOfModels, newSetOfModels),
                    _getNonIntersectIn2 = _slicedToArray(_getNonIntersectIn, 2),
                    modelsToUnsubscribe = _getNonIntersectIn2[0],
                    modelsToSubscribe = _getNonIntersectIn2[1];

                var _getNonIntersectIn3 = getNonIntersectIn(this.setOfCollections, newSetOfCollections),
                    _getNonIntersectIn4 = _slicedToArray(_getNonIntersectIn3, 2),
                    collectionsToUnsubscribe = _getNonIntersectIn4[0],
                    collectionsToSubscribe = _getNonIntersectIn4[1];

                this.subscribeTo(this.modelListener, modelsToSubscribe, 'change');
                this.subscribeCollection(this.collectionListener, collectionsToSubscribe);

                this.unsubscribeFrom(this.modelListener, modelsToUnsubscribe);
                this.unsubscribeFrom(this.collectionListener, collectionsToUnsubscribe);

                this.setOfModels = newSetOfModels;
                this.setOfCollections = newSetOfCollections;
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                this.modelListener.stopListening();
                this.collectionListener.stopListening();
            }
        }, {
            key: 'render',
            value: function render() {
                var _this3 = this;

                return _react2.default.createElement(WrappedComponent, _extends({ ref: function ref(wrappedComponent) {
                        _this3.wrappedComponent = wrappedComponent;
                    }
                }, this.props));
            }
        }]);

        return WithBackbone;
    }(_react2.default.Component);

    WithBackbone.displayName = 'WithBackbone(' + getDisplayName(WrappedComponent) + ')';

    return WithBackbone;
};

exports.withBackbone = withBackbone;
exports.default = withBackbone;
