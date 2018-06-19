/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 19);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractModel = __webpack_require__(12);
const NotImplementedError = __webpack_require__(3).default;
const resolve = __webpack_require__(27);
const filter = __webpack_require__(28);
let _configs;

module.exports = class AbstractEventModel extends AbstractModel {

	constructor() {
		super();
		this.mainDataType = Object;
		_configs = _configs || __webpack_require__(2);
	}

	setMainData(data = {}) {
		const keyList = this.getMainDataKey().split('.');
		const lastKey = keyList.pop();
		const key = keyList.join('.');
		const container = resolve(key, this) || {};

		if (container) {
			const isOfMainType = data.constructor !== Array ? this.isOfMainType(data) : data.every((d) => {
				return this.isOfMainType(d);
			});

			if (!isOfMainType) {
				if (_configs.get('debug', false)) {
					// eslint-disable-next-line no-console
					console.warn(`The main data does not fit the expected type: ${this.getMainDataType().name}`);
				}
			}
			if (container[lastKey] && container[lastKey].constructor === Array && data.constructor !== Array) {
				container[lastKey].push(data);
			} else {
				container[lastKey] = data;
			}
		}
	}

	getMainDataKey() {
		if (this.mainDataKey) {
			return this.mainDataKey;
		}

		throw new NotImplementedError();
	}

	getMainDataType() {
		return this.mainDataType || Object;
	}

	isOfMainType(data) {
		return Object.keys(filter((new (this.getMainDataType())()).getRequiredFields(), (val, key) => {
			return typeof val === 'function' ? val(key, this) : Boolean(val);
		})).every((key) => {
			return typeof data[key] === 'boolean' || data[key];
		});
	}

	getWhitelistedFunctions() {
		return ['eventCallback'];
	}

	getEventName() {
		const cleanName = this.modelName.replace(/(Event)?Model$/, '');

		return `${cleanName.charAt(0).toLowerCase()}${cleanName.slice(1)}`;
	}

};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const ImpressionDataModel = __webpack_require__(7);

module.exports = class ProductDataModel extends ImpressionDataModel {

	static get modelName() {
		return 'ProductDataModel';
	}

	getDefaultModelData() {
		const data = super.getDefaultModelData();
		const additionalData = {
			quantity: 1,
			coupon: ''
		};

		Object.keys(additionalData).forEach((k) => {
			data[k] = additionalData[k];
		});

		return data;
	}

};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const defaultConfigs = __webpack_require__(25);

const _config = {};

class ConfigRepository {

	get(key, defaultValue = null) {
		return this.has(key) ? _config[key] : defaultValue;
	}

	set(key, value) {
		_config[key] = value;

		if (!(Object.getOwnPropertyDescriptor(this, key) || {}).get) {
			Object.defineProperty(this, key, {
				get: function() {
					return this.get(key);
				},
				set: function(v) {
					this.set(key, v);
				}
			});
		}

		return this;
	}

	has(key) {
		return typeof _config[key] !== 'undefined';
	}

	remove(key) {
		delete _config[key];

		return this;
	}

	all() {
		const constantsCopy = {};

		for (const key in _config) {
			if (typeof _config[key] !== 'undefined') {
				constantsCopy[key] = _config[key];
			}
		}

		return constantsCopy;
	}

}

const configs = new ConfigRepository();

for (const key in defaultConfigs) {
	if (defaultConfigs[key]) {
		configs.set(key, defaultConfigs[key]);
	}
}

module.exports = configs;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = class NotImplementedError extends Error {

	constructor(method) {
		// eslint-disable-next-line no-caller
		super(`Method ${(method || arguments.callee.caller.name)}() must be implemented.`);
	}

};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractDataModel = __webpack_require__(8);

module.exports = class ActionFieldDataModel extends AbstractDataModel {

	static get modelName() {
		return 'ActionFieldDataModel';
	}

};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const NotImplementedError = __webpack_require__(3);

module.exports = class AbstractInsiteMapper {

	constructor() {
		this.pipes = [];
	}

	map(data) {
		const mappedData = [];
		this.getDataCollection(data).forEach((item) => {
			const dataModel = this.getModel();
			this.executePipeline(dataModel, item, data);
			mappedData.push(dataModel.getData());
		});

		return mappedData;
	}

	registerPipe(pipe, order = 0) {
		this.pipes.push({ pipe, order });

		return this;
	}

	executePipeline(dataModel, rawData, context) {
		this.pipes.sort((a, b) => {
			return a.order > b.order;
		}).forEach((pipeData) => {
			pipeData.pipe(dataModel, rawData, context);
		});

		Object.keys(dataModel).forEach((k) => {
			if (typeof dataModel[k] === 'undefined') {
				delete dataModel[k];
			}
		});
	}

	getModel() {
		throw new NotImplementedError();
	}

	getModelName() {
		return this.getModel().modelName;
	}

	getDataCollection(data) {
		return data.constructor === Array ? data : [data];
	}

};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

const configs = {
	prefix: 'swivInsite',
	getName: (name) => {
		const _name = name.replace(new RegExp(`^${configs.prefix}`), '');

		return `${configs.prefix}${_name.charAt(0).toUpperCase()}${_name.slice(1)}`;
	},
	guidRegExp: '[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}'
};

module.exports = configs;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractDataModel = __webpack_require__(8);

module.exports = class ImpressionDataModel extends AbstractDataModel {

	static get modelName() {
		return 'ImpressionDataModel';
	}

	getDefaultModelData() {
		return {
			name: '',
			id: '',
			brand: '',
			category: '',
			variant: '',
			list: '',
			position: 1,
			price: 0
		};
	}

	getRequiredFields() {
		return {
			id: (product) => {
				return !product.name;
			},
			name: (product) => {
				return !product.id;
			}
		};
	}

};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractModel = __webpack_require__(12);

module.exports = class AbstractDataModel extends AbstractModel {

	getRequiredFields() {
		return {};
	}

};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractDataModel = __webpack_require__(8);

module.exports = class PromotionDataModel extends AbstractDataModel {

	static get modelName() {
		return 'PromotionDataModel';
	}

	getDefaultModelData() {
		return {
			id: '',
			name: '',
			creative: '',
			position: ''
		};
	}

	getRequiredFields() {
		return {
			id: (promotion, event) => {
				return ['purchase', 'refund'].indexOf(event.modelName) !== -1;
			}
		};
	}

};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const { getName } = __webpack_require__(6);

module.exports = getName('gee');


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const { getName } = __webpack_require__(6);

module.exports = getName('interceptor');


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const NotImplementedError = __webpack_require__(3);
let _configs;

module.exports = class AbstractModel {

	static get modelName() {
		throw new NotImplementedError();
	}

	constructor(data = {}) {
		_configs = _configs || __webpack_require__(2);
		this.map(this.getDefaultModelData()).map(data);
	}

	map(data) {
		for (const prop in data) {
			if (typeof data[prop] !== 'undefined') {
				this.set(prop, data[prop], data);
			}
		}

		return this;
	}

	set(prop, value, context) {
		this[prop] = this.mapPropertyValue(prop, value, context);

		return this;
	}

	getData() {
		const data = {};
		const whitelistedFunctions = this.getWhitelistedFunctions();

		for (const prop in this) {
			if (typeof this[prop] !== 'undefined') {
				const type = typeof this[prop];

				if (type !== 'undefined' && (typeof this[prop] !== 'function' || whitelistedFunctions.indexOf(prop) !== -1)) {
					data[prop] = this[prop];
				}
			}
		}

		return data;
	}

	getConfigRepository() {
		return _configs;
	}

	getWhitelistedFunctions() {
		return [];
	}

	mapPropertyValue(prop, value, context = {}) { // eslint-disable-line no-unused-vars
		return value;
	}

	getDefaultModelData() {
		return {};
	}

	get modelName() {
		return this.constructor.modelName;
	}

};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const NotImplementedError = __webpack_require__(3);

module.exports = class QueuableServiceFactory {

	getService() {
		throw new NotImplementedError();
	}

};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractServiceFactory = __webpack_require__(13);
const NoQueueServiceError = __webpack_require__(43);

module.exports = class AbstractQueuableServiceFactory extends AbstractServiceFactory {

	constructor() {
		super();
		this.queuedServices = [];
	}

	queueService(service) {
		this.queuedServices.push(service);

		return this;
	}

	getService() {
		if (this.queuedServices.length === 0) {
			throw new NoQueueServiceError();
		}

		return this.queuedServices[this.queuedServices.length - 1];
	}

};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = [
	__webpack_require__(55),
	__webpack_require__(56),
	__webpack_require__(57),
	__webpack_require__(58),
	__webpack_require__(59),
	__webpack_require__(60),
	__webpack_require__(61),
	__webpack_require__(62)
];


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = 'insite.swiv';


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = 'swivGee';


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

const prefix = __webpack_require__(17);

module.exports = `${prefix}Position`;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(20);


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(21);
__webpack_require__(47);
__webpack_require__(69);

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

window.swiv = __webpack_require__(22);


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
	gee: __webpack_require__(23)
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(24);


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(2);
const GeeFactory = __webpack_require__(40);

module.exports = new GeeFactory();


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
	dataLayer: 'dataLayer',
	gtm: 'google_tag_manager',
	eventPrefix: 'swiv.gee.',
	events: [
		__webpack_require__(26),
		__webpack_require__(29),
		__webpack_require__(30),
		__webpack_require__(31),
		__webpack_require__(32),
		__webpack_require__(33),
		__webpack_require__(34),
		__webpack_require__(35),
		__webpack_require__(36),
		__webpack_require__(37),
		__webpack_require__(38),
		__webpack_require__(39)
	]
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractEventModel = __webpack_require__(0);

module.exports = class DefaultEventModel extends AbstractEventModel {

	static get modelName() {
		return 'DefaultEventModel';
	}

	getDefaultModelData() {
		return {
			ecommerce: {}
		};
	}

	getMainDataKey() {
		return 'ecommerce';
	}

	getMainDataType() {
		return Object;
	}

};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (path, obj = {}) => {
	return path.split('.').reduce((prev, curr) => {
		return prev ? prev[curr] : undefined;
	}, obj);
};


/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = (obj, predicate) => {
	const result = {};

	for (const key in obj) {
		if (predicate(obj[key], key)) {
			result[key] = obj[key];
		}
	}

	return result;
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractEventModel = __webpack_require__(0);
const ProductModel = __webpack_require__(1);

module.exports = class AddToCartEventModel extends AbstractEventModel {

	static get modelName() {
		return 'AddToCartEventModel';
	}

	getDefaultModelData() {
		return {
			event: 'addToCart',
			ecommerce: {
				currencyCode: this.getConfigRepository().get('currencyCode', 'USD'),
				add: {
					products: []
				}
			}
		};
	}

	getMainDataKey() {
		return 'ecommerce.add.products';
	}

	getMainDataType() {
		return ProductModel;
	}

};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractEventModel = __webpack_require__(0);
const ProductModel = __webpack_require__(1);

module.exports = class CheckoutEventModel extends AbstractEventModel {

	static get modelName() {
		return 'CheckoutEventModel';
	}

	getDefaultModelData() {
		return {
			event: 'checkout',
			ecommerce: {
				actionField: {
					step: 1,
					option: this.getConfigRepository().get('defaultCreditCard', '')
				},
				products: []
			},
			eventCallback: () => {} // eslint-disable-line no-empty-function
		};
	}

	getMainDataKey() {
		return 'ecommerce.products';
	}

	getMainDataType() {
		return ProductModel;
	}

};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractEventModel = __webpack_require__(0);
const ActionFieldModel = __webpack_require__(4);

module.exports = class CheckoutOptionEventModel extends AbstractEventModel {

	static get modelName() {
		return 'CheckoutOptionEventModel';
	}

	getDefaultModelData() {
		return {
			event: 'checkoutOption',
			ecommerce: {
				checkout_option: { // eslint-disable-line camelcase
					actionField: {
						step: 1,
						option: this.getConfigRepository().get('defaultCreditCard', '')
					}
				}
			}
		};
	}

	getMainDataKey() {
		return 'ecommerce.checkout_option.actionField';
	}

	getMainDataType() {
		return ActionFieldModel;
	}

};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractEventModel = __webpack_require__(0);
const ImpressionDataModel = __webpack_require__(7);

module.exports = class ProductImpressionEventModel extends AbstractEventModel {

	static get modelName() {
		return 'ProductImpressionEventModel';
	}

	getDefaultModelData() {
		return {
			event: 'productImpression',
			ecommerce: {
				currencyCode: this.getConfigRepository().get('currencyCode', 'USD'),
				impressions: []
			}
		};
	}

	getMainDataKey() {
		return 'ecommerce.impressions';
	}

	getMainDataType() {
		return ImpressionDataModel;
	}

};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractEventModel = __webpack_require__(0);
const ProductModel = __webpack_require__(1);

module.exports = class ProductClickEventModel extends AbstractEventModel {

	static get modelName() {
		return 'ProductClickEventModel';
	}

	getDefaultModelData() {
		return {
			event: 'productClick',
			ecommerce: {
				click: {
					actionField: {},
					products: []
				}
			},
			eventCallback: () => {} // eslint-disable-line no-empty-function
		};
	}

	getMainDataKey() {
		return 'ecommerce.click.products';
	}

	getMainDataType() {
		return ProductModel;
	}

};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractEventModel = __webpack_require__(0);
const ProductModel = __webpack_require__(1);

module.exports = class ProductDetailEventModel extends AbstractEventModel {

	static get modelName() {
		return 'ProductDetailEventModel';
	}

	getDefaultModelData() {
		return {
			event: 'productDetail',
			ecommerce: {
				detail: {
					actionField: {},
					products: []
				}
			}
		};
	}

	getMainDataKey() {
		return 'ecommerce.detail.products';
	}

	getMainDataType() {
		return ProductModel;
	}

};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractEventModel = __webpack_require__(0);
const PromotionModel = __webpack_require__(9);

module.exports = class PromoClickEventModel extends AbstractEventModel {

	static get modelName() {
		return 'PromoClickEventModel';
	}

	getDefaultModelData() {
		return {
			event: 'promotionClick',
			ecommerce: {
				promoClick: {
					promotions: []
				}
			},
			eventCallback: () => {} // eslint-disable-line no-empty-function
		};
	}

	getMainDataKey() {
		return 'ecommerce.promoClick.promotions';
	}

	getMainDataType() {
		return PromotionModel;
	}

};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractEventModel = __webpack_require__(0);
const PromotionModel = __webpack_require__(9);

module.exports = class PromoViewEventModel extends AbstractEventModel {

	static get modelName() {
		return 'PromoViewEventModel';
	}

	getDefaultModelData() {
		return {
			event: 'promotionView',
			ecommerce: {
				promoView: {
					promotions: []
				}
			}
		};
	}

	getMainDataKey() {
		return 'ecommerce.promoView.promotions';
	}

	getMainDataType() {
		return PromotionModel;
	}

};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractEventModel = __webpack_require__(0);
const ActionFieldModel = __webpack_require__(4);

module.exports = class PurchaseEventModel extends AbstractEventModel {

	static get modelName() {
		return 'PurchaseEventModel';
	}

	getDefaultModelData() {
		return {
			event: 'purchase',
			ecommerce: {
				purchase: {
					actionField: new ActionFieldModel()
				}
			}
		};
	}

	getMainDataKey() {
		return 'ecommerce.purchase.actionField';
	}

	getMainDataType() {
		return ActionFieldModel;
	}

};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractEventModel = __webpack_require__(0);
const ActionFieldModel = __webpack_require__(4);

module.exports = class RefundEventModel extends AbstractEventModel {

	static get modelName() {
		return 'RefundEventModel';
	}

	getDefaultModelData() {
		return {
			event: 'refund',
			ecommerce: {
				refund: {
					actionField: new ActionFieldModel()
				}
			}
		};
	}

	getMainDataKey() {
		return 'ecommerce.refund.actionField';
	}

	getMainDataType() {
		return ActionFieldModel;
	}

};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractEventModel = __webpack_require__(0);
const ProductModel = __webpack_require__(1);

module.exports = class RemoveFromCartEventModel extends AbstractEventModel {

	static get modelName() {
		return 'RemoveFromCartEventModel';
	}

	getDefaultModelData() {
		return {
			event: 'removeFromCart',
			ecommerce: {
				remove: {
					products: []
				}
			}
		};
	}

	getMainDataKey() {
		return 'ecommerce.remove.products';
	}

	getMainDataType() {
		return ProductModel;
	}

};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

const FactoryContract = __webpack_require__(13);
const GoogleEnhancedEcommerceService = __webpack_require__(41);

const eventServiceFactory = new (__webpack_require__(42))();
const mapperServiceFactory = new (__webpack_require__(45))();
const configs = __webpack_require__(2);

let _singleton;

module.exports = class GoogleEnhancedEcommerceServiceFactory extends FactoryContract {

	constructor() {
		super();
		this.configs = configs;
	}

	setEventService(service) {
		eventServiceFactory.queueService(service);

		return this;
	}

	setMapperService(service) {
		mapperServiceFactory.queueService(service);

		return this;
	}

	getService() {
		if (!_singleton) {
			const eventService = eventServiceFactory.getService();
			const mapperService = mapperServiceFactory.getService();
			_singleton = new GoogleEnhancedEcommerceService(eventService, mapperService, this.configs);
		}

		return _singleton;
	}

};


/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = class GoogleEnhancedEcommerceService {

	constructor(eventService, mapperService, configs) {
		this.eventService = eventService;
		this.mapperService = mapperService;
		this.configs = configs;

		configs.events.forEach((event) => {
			this.registerEvent(this.getCleanEventName(event));
		});
	}

	registerEvent(event) {
		this.eventService.subscribe(this.getEventName(event), (data) => {
			window[this.configs.get('dataLayer', 'dataLayer')].push(data);
		});

		this[`trigger${this.getCleanEventName(this.getEventModelClass(event), true)}`] = (data) => {
			return this.trigger(event, data);
		};

		return this;
	}

	trigger(event, data = {}) {
		const mappedData = this.mapperService.map(data, this.getEventModel(event));

		if (mappedData && Object.keys(mappedData).length > 0) {
			this.eventService.publish(this.getEventName(event), mappedData);
		}

		return this;
	}

	getEventName(event, withPrefix = true) {
		const prefix = withPrefix ? this.configs.get('eventPrefix', '') : '';

		return `${prefix}${event}`;
	}

	getEventModel(event) {
		const EventModel = this.getEventModelClass(event);

		return new EventModel();
	}

	getEventModelClass(event) {
		const eventCollection = this.configs.get('events', []);

		for (let i = eventCollection.length - 1; i >= 0; i--) {
			if (this.getCleanEventName(eventCollection[i]) === event) {
				return eventCollection[i];
			}
		}

		for (let j = 0; j < eventCollection.length; j++) {
			if (/^[dD]efault/.test(eventCollection[j].name)) {
				return eventCollection[j];
			}
		}

		return eventCollection[0];
	}

	getCleanEventName(event, toPascalCase = false) {
		const cleanName = event.modelName.replace(/(Event)?Model$/, '');

		return `${cleanName.charAt(0)[`to${(toPascalCase ? 'Upper' : 'Lower')}Case`]()}${cleanName.slice(1)}`;
	}

};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractQueuableServiceFactory = __webpack_require__(14);
const DefaultEventService = __webpack_require__(44);

module.exports = class EventServiceFactory extends AbstractQueuableServiceFactory {

	constructor() {
		super();
		this.queueService(new DefaultEventService());
	}

};


/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = class noQueueServiceError extends Error {

	constructor(message = 'There is no queued service.') {
		super(message);
	}

};


/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = class DefaultEventService {

	constructor() {
		this.events = {};
	}

	subscribe(event, callback) {
		const token = this.generateToken();
		this.events[event] = this.events[event] || [];
		this.events[event].push({ token, callback });

		return token;
	}

	unsubscribe(token) {
		for (const event in this.events) {
			if (this.events[event]) {
				for (let i = this.events[event].length - 1; i >= 0; i--) {
					if (this.events[event].token === token) {
						this.events[event].splice(i, 1);
					}
				}
			}
		}
	}

	publish(event, data = {}) {
		(this.events[event] || []).forEach((subscriber) => {
			subscriber.callback(data);
		});
	}

	generateToken() {
		return Math.random().toString(32).substr(2);
	}

};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractQueuableServiceFactory = __webpack_require__(14);
const DefaultMapperService = __webpack_require__(46);

module.exports = class MapperServiceFactory extends AbstractQueuableServiceFactory {

	constructor() {
		super();
		this.queueService(new DefaultMapperService());
	}

};


/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = class DefaultMapperService {

	map(data, event) {
		event.setMainData(data);

		return event;
	}

};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(48);


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(49);


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(50)();


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

const InsiteMapperService = __webpack_require__(51);
let hasBooted = false;

const boot = () => {
	if (!hasBooted && window.swiv && window.swiv.gee) {
		hasBooted = true;
		window.swiv.gee.setMapperService(new InsiteMapperService());
	}
};

window.addEventListener('swiv.gee.ready', boot);

module.exports = boot;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = class InsiteMapperService {

	constructor() {
		const mappers = [
			{
				mapper: __webpack_require__(52),
				defaultPipes: __webpack_require__(53)
			},
			{
				mapper: __webpack_require__(54),
				defaultPipes: __webpack_require__(15)
			},
			{
				mapper: __webpack_require__(63),
				defaultPipes: __webpack_require__(64)
			},
			{
				mapper: __webpack_require__(65),
				defaultPipes: __webpack_require__(66)
			}
		];

		this.mappers = {};

		mappers.forEach((mapperData) => {
			const MapperClass = mapperData.mapper;
			const mapper = new MapperClass();
			const event = mapper.getModelName();
			this.mappers[event] = mapper;

			mapperData.defaultPipes.forEach((pipe) => {
				this.registerPipe(event, pipe);
			});
		});
	}

	map(data, event) {
		const mapper = this.getDedicatedMapper(event);
		const mappedData = mapper ? mapper.map(data) : data;

		if (mappedData && (mappedData.constructor !== Array || mappedData.length > 0)) {
			event.setMainData(mappedData);

			return event.getData();
		}

		return null;
	}

	registerPipe(event, pipe, order = 0) {
		const mapper = this.getDedicatedMapper(event);

		if (mapper) {
			mapper.registerPipe(pipe, order);
		}
	}

	getDedicatedMapper(event) {
		return this.mappers[event] || this.mappers[event.getMainDataType().name] || null;
	}

};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractInsiteMapper = __webpack_require__(5);
const ActionFieldDataModel = __webpack_require__(4);

module.exports = class InsiteActionFieldDataModelMapper extends AbstractInsiteMapper {

	getModel() {
		return new ActionFieldDataModel();
	}

};


/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = [];


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractInsiteMapper = __webpack_require__(5);
const ImpressionDataModel = __webpack_require__(7);

module.exports = class InsiteProductDataModelMapper extends AbstractInsiteMapper {

	getModel() {
		return new ImpressionDataModel();
	}

	getDataCollection(data) {
		return data.products || [data.product || data];
	}

};


/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = (productImpressionDataModel, productDto) => {
	productImpressionDataModel.id = productDto.id;
};


/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports = (productImpressionDataModel, productDto) => {
	productImpressionDataModel.name = productDto.shortDescription;
};


/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports = (productImpressionDataModel, productDto, context) => {
	const lists = {
		search: 'Search Results',
		list: 'List Page',
		detail: 'Detail Page'
	};

	productImpressionDataModel.list = context.products ? lists[context.originalQuery ? 'search' : 'list'] : lists.detail;
};


/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = (productImpressionDataModel, productDto) => {
	if (productDto.properties) {
		productImpressionDataModel.brand = productDto.properties.brand;
	}
};


/***/ }),
/* 59 */
/***/ (function(module, exports) {

const resolveCategory = (productDto, context) => {
	if (productDto.properties && productDto.properties.category) {
		return productDto.properties.category;
	}

	if (context.properties && context.properties.category) {
		return context.properties.category;
	}

	let resolvedCategory = window.location.pathname.substr(1)
		.replace(/-/g, ' ')
		.split('/')
		.map((category) => {
			return `${category.charAt(0).toUpperCase()}${category.slice(1)}`;
		})
		.join('/');

	if (context.product) {
		resolvedCategory = resolvedCategory.replace(/\/[^/]{1,}$/, '');
	}

	return resolvedCategory;
};

module.exports = (productImpressionDataModel, productDto, context) => {
	productImpressionDataModel.category = resolveCategory(productDto, context);
};


/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = (productImpressionDataModel, productDto, context) => {
	delete productImpressionDataModel.position;

	if (productDto.properties && productDto.properties.position) {
		productImpressionDataModel.position = parseInt(productDto.properties.position, 10);
	} else if (context.products) {
		const page = context.pagination ? context.pagination.currentPage : 1;
		const perPage = context.pagination ? context.pagination.pageSize : 1;
		let pos = 0;

		for (let i = context.products.length - 1; i >= 0; i--) {
			if (context.products[i].id === productDto.id) {
				pos = i;
				break;
			}
		}

		productImpressionDataModel.position = ((page - 1) * perPage) + pos + 1;
	}
};


/***/ }),
/* 61 */
/***/ (function(module, exports) {

const getPricing = (productDto) => {
	if (productDto.pricing && productDto.pricing.unitListPrice && productDto.canShowPrice && productDto.canAddToCart) {
		return productDto.pricing.unitListPrice.toFixed(2);
	}

	return undefined;
};

module.exports = (productImpressionDataModel, productDto) => {
	productImpressionDataModel.price = getPricing(productDto);
};


/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = (productImpressionDataModel, productDto) => {
	productImpressionDataModel.variant = productDto.name || productDto.shortDescription;

	if (productImpressionDataModel.variant === productImpressionDataModel.name) {
		delete productImpressionDataModel.variant;
	}
};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractInsiteMapper = __webpack_require__(5);
const PromotionDataModel = __webpack_require__(9);

module.exports = class InsitePromotionDataModelMapper extends AbstractInsiteMapper {

	getModel() {
		return new PromotionDataModel();
	}

};


/***/ }),
/* 64 */
/***/ (function(module, exports) {

module.exports = [];


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractInsiteMapper = __webpack_require__(5);
const ProductDataModel = __webpack_require__(1);

module.exports = class InsiteProductDataModelMapper extends AbstractInsiteMapper {

	getModel() {
		return new ProductDataModel();
	}

	getDataCollection(data) {
		return data.products || [data.product || data];
	}

};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(15).concat([
	__webpack_require__(67),
	__webpack_require__(68)
]);


/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = (productDataModel, productDto) => {
	if (productDataModel.price) {
		productDataModel.quantity = productDto.quantity;
	} else {
		delete productDataModel.quantity;
	}
};


/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = (productDataModel) => {
	if (productDataModel.coupon === '') {
		delete productDataModel.coupon;
	}
};


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(70);


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = window.angular ? window.angular.module(__webpack_require__(16), __webpack_require__(71)) : null;


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = [
	__webpack_require__(72).name
];


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

const ngModule = __webpack_require__(73);

__webpack_require__(76)(ngModule);
__webpack_require__(79)(ngModule);
__webpack_require__(83)(ngModule);

module.exports = ngModule;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = window.angular ? window.angular.module(__webpack_require__(74), __webpack_require__(75)) : null;


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = `${__webpack_require__(16)}.core`;


/***/ }),
/* 75 */
/***/ (function(module, exports) {

module.exports = [

];


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (ngModule) => {
	__webpack_require__(77)(ngModule);
	__webpack_require__(78)(ngModule);
};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (ngModule) => {

	const GeeFactory = () => {
		return window.swiv.gee.getService();
	};

	GeeFactory.$inject = [];


	class GeeProvider {

		get $get() {
			return GeeFactory;
		}

	}

	GeeProvider.$inject = [];

	ngModule.provider(__webpack_require__(10), GeeProvider);
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (ngModule) => {

	let _endpointPrefix = '';

	let self;

	const _endpointActionCollection = {};

	class Interceptor {

		constructor(actions, geeService) {
			self = this;
			this.actions = actions;
			this.geeService = geeService;
		}

		response(res) {
			let url = res.config.url.replace(window.location.hostname, '');
			[url] = url.split('?');
			url = `${url.charAt(0) === '/' || (/http(s)?:/).test(url) ? '' : '/'}${url}`.replace(/\.json$/, '');

			if (res.config.gee !== false) {
				const triggerFn = ({ event, preprocess, process }) => {
					if (typeof preprocess === 'function') {
						preprocess(res.data);
					}

					if (typeof process === 'function') {
						process(res.data, self.geeService);
					} else {
						self.geeService.trigger(event, res.data);
					}
				};

				for (const endpoint in self.actions) {
					if (self.actions[endpoint] && self.actions[endpoint].length) {
						if ((new RegExp(`^${_endpointPrefix}${endpoint}(/)?$`)).test(url)) {
							self.actions[endpoint].forEach(triggerFn);
						}
					}
				}
			}

			return res;
		}

	}


	const InterceptorFactory = (geeService) => {
		return new Interceptor(_endpointActionCollection, geeService);
	};

	InterceptorFactory.$inject = [__webpack_require__(10)];


	class InterceptorProvider {

		addAction(endpoint, action) {
			const defaultAction = {
				event: '',
				mainDataName: null,
				getMainData: (data) => {
					return data;
				}
			};

			Object.keys(defaultAction).forEach((key) => {
				action[key] = action[key] || defaultAction[key];
			});

			return this.safePush(_endpointActionCollection, endpoint, action);
		}

		set endpointPrefix(value) {
			_endpointPrefix = value;
		}

		get endpointPrefix() {
			return _endpointPrefix;
		}

		safePush(arr, key, value) {
			arr[key] = arr[key] || [];
			arr[key].push(value);

			return this;
		}

		get $get() {
			return InterceptorFactory;
		}

	}

	InterceptorProvider.$inject = [];

	ngModule.provider(__webpack_require__(11), InterceptorProvider);
};


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (ngModule) => {
	__webpack_require__(80)(ngModule);
	__webpack_require__(82)(ngModule);
};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

const directiveName = __webpack_require__(81);
const positionDirective = __webpack_require__(18).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

module.exports = (ngModule) => {

	ngModule.directive(directiveName, [
		__webpack_require__(10),
		(geeService) => {
			return {
				restrict: 'AC',
				scope: {
					product: `=${directiveName}`
				},
				link: ($scope, $element) => {
					$element.on('click', () => {
						const position = $element.attr(positionDirective) || $element.closest(`[${positionDirective}]`).attr(positionDirective);
						const product = window.angular.copy($scope.product);
						product.properties = product.properties || {};
						product.properties.position = position;
						geeService.triggerProductClick(product);
					});
				}
			};
		}
	]);
};


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

const prefix = __webpack_require__(17);

module.exports = `${prefix}Product`;


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

const directiveName = __webpack_require__(18);

module.exports = (ngModule) => {

	ngModule.directive(directiveName, [
		() => {
			return {
				restrict: 'A'
			};
		}
	]);
};


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (ngModule) => {
	__webpack_require__(84)(ngModule);
	__webpack_require__(85)(ngModule);
};


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

const interceptor = __webpack_require__(11);

module.exports = (ngModule) => {

	ngModule.config([
		'$httpProvider',
		($httpProvider) => {
			$httpProvider.interceptors.push(interceptor);
		}
	]);
};


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

const interceptor = __webpack_require__(11);

const _actions = [
	__webpack_require__(86),
	__webpack_require__(87),
	__webpack_require__(88),
	__webpack_require__(89),
	__webpack_require__(90),
	__webpack_require__(91)
];

module.exports = (ngModule) => {
	ngModule.config([
		`${interceptor}Provider`,
		($interceptorProvider) => {
			$interceptorProvider.endpointPrefix = '/api/v1';
			_actions.forEach((action) => {
				$interceptorProvider.addAction(action.endpoint, action);
			});
		}
	]);
};


/***/ }),
/* 86 */
/***/ (function(module, exports) {

module.exports = {
	endpoint: '/products',
	event: 'productImpression'
};


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

const { guidRegExp } = __webpack_require__(6);

module.exports = {
	endpoint: `/products/${guidRegExp}`,
	event: 'productDetail'
};


/***/ }),
/* 88 */
/***/ (function(module, exports) {

module.exports = {
	endpoint: '/websites/current/crosssells',
	event: 'productImpression'
};


/***/ }),
/* 89 */
/***/ (function(module, exports) {

module.exports = {
	endpoint: `/wishlists`,
	event: 'productImpression',
	preprocess: (response) => {
		const products = [];

		response.wishListCollection.forEach((wishList) => {
			(wishList.wishListLineCollection || []).forEach((wishListLine) => {
				products.push(wishListLine);
			});
		});

		response.products = products;
	}
};


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

const { guidRegExp } = __webpack_require__(6);

module.exports = {
	endpoint: `/wishlists/${guidRegExp}`,
	event: 'productImpression',
	preprocess: (response) => {
		response.products = response.wishListLineCollection;
	}
};


/***/ }),
/* 91 */
/***/ (function(module, exports) {

module.exports = {
	endpoint: '/sessions/current',
	process: (data, geeService) => {
		geeService.configs.set('currencyCode', data.currency.currencyCode);
	}
};


/***/ })
/******/ ]);