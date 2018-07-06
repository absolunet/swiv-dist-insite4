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
/******/ 	return __webpack_require__(__webpack_require__.s = 25);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AbstractModel = __webpack_require__(16);
const NotImplementedError = __webpack_require__(5).default;
const resolve = __webpack_require__(33);
const filter = __webpack_require__(34);
let _configs;

module.exports = class AbstractEventModel extends AbstractModel {

	constructor() {
		super();
		this.mainDataType = Object;
		_configs = _configs || __webpack_require__(4);
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

module.exports = {
	name: __webpack_require__(86),
	url: __webpack_require__(87),
	regex: __webpack_require__(88)
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ImpressionDataModel = __webpack_require__(9);

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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const prefix = __webpack_require__(8);

module.exports = `${prefix}Product`;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const defaultConfigs = __webpack_require__(31);

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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = class NotImplementedError extends Error {

	constructor(method) {
		// eslint-disable-next-line no-caller
		super(`Method ${(method || arguments.callee.caller.name)}() must be implemented.`);
	}

};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const NotImplementedError = __webpack_require__(5);

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

		this.cleanDataModel(dataModel);
	}

	cleanDataModel(dataModel) {
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const { name:nameHelper } = __webpack_require__(1);

module.exports = nameHelper.getName('gee');


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = 'swivGee';


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AbstractDataModel = __webpack_require__(10);

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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AbstractModel = __webpack_require__(16);

module.exports = class AbstractDataModel extends AbstractModel {

	getRequiredFields() {
		return {};
	}

};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AbstractDataModel = __webpack_require__(10);

module.exports = class ActionFieldDataModel extends AbstractDataModel {

	static get modelName() {
		return 'ActionFieldDataModel';
	}

};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AbstractDataModel = __webpack_require__(10);

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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const { name:nameHelper } = __webpack_require__(1);

module.exports = nameHelper.getName('interceptor');


/***/ }),
/* 14 */
/***/ (function(module, exports) {

class Injectable {

	static get $inject() {
		return [];
	}

	static get aliases() {
		return {};
	}

	constructor(...args) {
		const { aliases } = this.constructor;
		this.constructor.$inject.forEach((dependency, index) => {
			this[aliases[dependency] || dependency] = args[index];
		});

		this.init();
	}

	init() {
		// eslint-disable-line empty-function
	}

}

module.exports = {
	Injectable
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const { name:nameHelper } = __webpack_require__(1);

module.exports = nameHelper.getName('propertyHistory');


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const NotImplementedError = __webpack_require__(5);
let _configs;

module.exports = class AbstractModel {

	static get modelName() {
		throw new NotImplementedError();
	}

	constructor(data = {}) {
		_configs = _configs || __webpack_require__(4);
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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const NotImplementedError = __webpack_require__(5);

module.exports = class QueuableServiceFactory {

	getService() {
		throw new NotImplementedError();
	}

};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AbstractServiceFactory = __webpack_require__(17);
const NoQueueServiceError = __webpack_require__(49);

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
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = [
	__webpack_require__(61),
	__webpack_require__(62),
	__webpack_require__(63),
	__webpack_require__(64),
	__webpack_require__(65),
	__webpack_require__(66),
	__webpack_require__(67),
	__webpack_require__(68)
];


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = 'insite.swiv';


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = {
	endpointCollection: {},
	prefix: ''
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

const prefix = __webpack_require__(8);

module.exports = `${prefix}Position`;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

const prefix = __webpack_require__(8);

module.exports = `${prefix}ProductClick`;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

const prefix = __webpack_require__(8);

module.exports = `${prefix}RemoveFromCart`;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(26);


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(27);
__webpack_require__(53);
__webpack_require__(75);

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

window.swiv = __webpack_require__(28);


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
	gee: __webpack_require__(29)
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(30);


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(4);
const GeeFactory = __webpack_require__(46);

module.exports = new GeeFactory();


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	dataLayer: 'dataLayer',
	gtm: 'google_tag_manager',
	eventPrefix: 'swiv.gee.',
	events: [
		__webpack_require__(32),
		__webpack_require__(35),
		__webpack_require__(36),
		__webpack_require__(37),
		__webpack_require__(38),
		__webpack_require__(39),
		__webpack_require__(40),
		__webpack_require__(41),
		__webpack_require__(42),
		__webpack_require__(43),
		__webpack_require__(44),
		__webpack_require__(45)
	]
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (path, obj = {}) => {
	return path.split('.').reduce((prev, curr) => {
		return prev ? prev[curr] : undefined;
	}, obj);
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (obj, predicate) => {
	const result = {};

	Object.keys(obj).forEach((key) => {
		if (predicate(obj[key], key)) {
			result[key] = obj[key];
		}
	});

	return result;
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AbstractEventModel = __webpack_require__(0);
const ProductModel = __webpack_require__(2);

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
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AbstractEventModel = __webpack_require__(0);
const ProductModel = __webpack_require__(2);

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
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AbstractEventModel = __webpack_require__(0);
const ActionFieldModel = __webpack_require__(11);

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
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AbstractEventModel = __webpack_require__(0);
const ImpressionDataModel = __webpack_require__(9);

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
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AbstractEventModel = __webpack_require__(0);
const ProductModel = __webpack_require__(2);

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
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AbstractEventModel = __webpack_require__(0);
const ProductModel = __webpack_require__(2);

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
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AbstractEventModel = __webpack_require__(0);
const PromotionModel = __webpack_require__(12);

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
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AbstractEventModel = __webpack_require__(0);
const PromotionModel = __webpack_require__(12);

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
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AbstractEventModel = __webpack_require__(0);
const ProductDataModel = __webpack_require__(2);

module.exports = class PurchaseEventModel extends AbstractEventModel {

	static get modelName() {
		return 'PurchaseEventModel';
	}

	getDefaultModelData() {
		return {
			event: 'purchase',
			ecommerce: {
				purchase: {
					actionField: {},
					products: []
				}
			}
		};
	}

	getMainDataKey() {
		return 'ecommerce.purchase.products';
	}

	getMainDataType() {
		return ProductDataModel;
	}

};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AbstractEventModel = __webpack_require__(0);
const ActionFieldModel = __webpack_require__(11);

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
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AbstractEventModel = __webpack_require__(0);
const ProductModel = __webpack_require__(2);

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
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const FactoryContract = __webpack_require__(17);
const GoogleEnhancedEcommerceService = __webpack_require__(47);

const eventServiceFactory = new (__webpack_require__(48))();
const mapperServiceFactory = new (__webpack_require__(51))();
const configs = __webpack_require__(4);

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
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AbstractQueuableServiceFactory = __webpack_require__(18);
const DefaultEventService = __webpack_require__(50);

module.exports = class EventServiceFactory extends AbstractQueuableServiceFactory {

	constructor() {
		super();
		this.queueService(new DefaultEventService());
	}

};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = class noQueueServiceError extends Error {

	constructor(message = 'There is no queued service.') {
		super(message);
	}

};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AbstractQueuableServiceFactory = __webpack_require__(18);
const DefaultMapperService = __webpack_require__(52);

module.exports = class MapperServiceFactory extends AbstractQueuableServiceFactory {

	constructor() {
		super();
		this.queueService(new DefaultMapperService());
	}

};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = class DefaultMapperService {

	map(data, event) {
		event.setMainData(data);

		return event;
	}

};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(54);


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(55);


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(56)();


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

const InsiteMapperService = __webpack_require__(57);
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
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = class InsiteMapperService {

	constructor() {
		const mappers = [
			{
				mapper: __webpack_require__(58),
				defaultPipes: __webpack_require__(59)
			},
			{
				mapper: __webpack_require__(60),
				defaultPipes: __webpack_require__(19)
			},
			{
				mapper: __webpack_require__(69),
				defaultPipes: __webpack_require__(70)
			},
			{
				mapper: __webpack_require__(71),
				defaultPipes: __webpack_require__(72)
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
		return this.mappers[event] || this.mappers[event.getMainDataType().modelName] || null;
	}

};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractInsiteMapper = __webpack_require__(6);
const ActionFieldDataModel = __webpack_require__(11);

module.exports = class InsiteActionFieldDataModelMapper extends AbstractInsiteMapper {

	getModel() {
		return new ActionFieldDataModel();
	}

};


/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = [];


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractInsiteMapper = __webpack_require__(6);
const ImpressionDataModel = __webpack_require__(9);

module.exports = class InsiteProductDataModelMapper extends AbstractInsiteMapper {

	getModel() {
		return new ImpressionDataModel();
	}

	getDataCollection(data) {
		return data.products || (data instanceof Array ? data : [data.product || data]);
	}

	cleanDataModel(dataModel) {
		super.cleanDataModel(dataModel);
		if (!dataModel.list) {
			delete dataModel.list;
		}
	}

};


/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = (productImpressionDataModel, productDto) => {
	productImpressionDataModel.id = productDto.id;
};


/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = (productImpressionDataModel, productDto) => {
	productImpressionDataModel.name = productDto.shortDescription;
};


/***/ }),
/* 63 */
/***/ (function(module, exports) {

module.exports = (productImpressionDataModel, productDto, context) => {
	const lists = {
		search: 'Search Results',
		list: 'List Page',
		detail: 'Detail Page'
	};

	productImpressionDataModel.list = typeof context.list !== 'undefined' ? context.list
		: (context.properties ? context.properties.list : null) || (context.products ? lists[context.originalQuery ? 'search' : 'list'] : lists.detail);
};


/***/ }),
/* 64 */
/***/ (function(module, exports) {

module.exports = (productImpressionDataModel, productDto) => {
	if (productDto.properties) {
		productImpressionDataModel.brand = productDto.properties.brand;
	}
};


/***/ }),
/* 65 */
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
/* 66 */
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
/* 67 */
/***/ (function(module, exports) {

const getPricing = (productDto) => {
	if (productDto.pricing && productDto.pricing.unitListPrice && (typeof productDto.canShowPrice === 'undefined' || productDto.canShowPrice) && productDto.canAddToCart) {
		return productDto.pricing.unitListPrice.toFixed(2);
	}

	return undefined;
};

module.exports = (productImpressionDataModel, productDto) => {
	productImpressionDataModel.price = getPricing(productDto);
};


/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = (productImpressionDataModel, productDto) => {
	productImpressionDataModel.variant = productDto.name || productDto.shortDescription;

	if (productImpressionDataModel.variant === productImpressionDataModel.name) {
		delete productImpressionDataModel.variant;
	}
};


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractInsiteMapper = __webpack_require__(6);
const PromotionDataModel = __webpack_require__(12);

module.exports = class InsitePromotionDataModelMapper extends AbstractInsiteMapper {

	getModel() {
		return new PromotionDataModel();
	}

};


/***/ }),
/* 70 */
/***/ (function(module, exports) {

module.exports = [];


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractInsiteMapper = __webpack_require__(6);
const ProductDataModel = __webpack_require__(2);

module.exports = class InsiteProductDataModelMapper extends AbstractInsiteMapper {

	getModel() {
		return new ProductDataModel();
	}

	getDataCollection(data) {
		return data.products || [data.product || data];
	}

};


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(19).concat([
	__webpack_require__(73),
	__webpack_require__(74)
]);


/***/ }),
/* 73 */
/***/ (function(module, exports) {

module.exports = (productDataModel, productDto, context) => {
	productDto.properties = productDto.properties || {};
	if (productDataModel.price) {
		if (typeof productDataModel.quantity !== 'undefined') {
			[productDataModel.quantity] = [
				productDto.qtyAdded,
				productDto.qtyRemoved,
				productDto.properties.qtyAdded,
				productDto.properties.qtyRemoved,
				context.qtyAdded,
				context.qtyRemoved,
				productDto.qtyOrdered
			].filter((value) => {
				return typeof value !== 'undefined';
			});
		}
	} else {
		delete productDataModel.quantity;
	}
};


/***/ }),
/* 74 */
/***/ (function(module, exports) {

module.exports = (productDataModel) => {
	if (productDataModel.coupon === '') {
		delete productDataModel.coupon;
	}
};


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(76);


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = window.angular ? window.angular.module(__webpack_require__(20), __webpack_require__(77)) : null;


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = [
	__webpack_require__(78).name
];


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

const ngModule = __webpack_require__(79);

__webpack_require__(82)(ngModule);
__webpack_require__(97)(ngModule);
__webpack_require__(112)(ngModule);

module.exports = ngModule;


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = window.angular ? window.angular.module(__webpack_require__(80), __webpack_require__(81)) : null;


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = `${__webpack_require__(20)}.core`;


/***/ }),
/* 81 */
/***/ (function(module, exports) {

module.exports = [

];


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (ngModule) => {
	__webpack_require__(83)(ngModule);
	__webpack_require__(89)(ngModule);
	__webpack_require__(93)(ngModule);
};


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

const GeeProvider = __webpack_require__(84);

module.exports = (ngModule) => {
	ngModule.provider(__webpack_require__(7), GeeProvider);
};


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

const GeeFactory = __webpack_require__(85);

class GeeProvider {

	get $get() {
		return GeeFactory;
	}

}

GeeProvider.$inject = [];

module.exports = GeeProvider;


/***/ }),
/* 85 */
/***/ (function(module, exports) {

const GeeFactory = () => {
	return window.swiv.gee.getService();
};

GeeFactory.$inject = [];

module.exports = GeeFactory;


/***/ }),
/* 86 */
/***/ (function(module, exports) {

class NameHelper {

	get prefix() {
		return 'swivInsite';
	}

	getName(name) {
		const [start, end] = [this.prefix.charAt(0), this.prefix.slice(1)];
		const _name = name.replace(new RegExp(`^[${start.toLowerCase()}${start.toUpperCase()}]${end}`), '');

		return `${this.prefix}${_name.charAt(0).toUpperCase()}${_name.slice(1)}`;
	}

}

module.exports = new NameHelper();


/***/ }),
/* 87 */
/***/ (function(module, exports) {

class UrlHelper {

	getUri(url) {
		return url
			.replace(/^http(s)?:\/\//, '')
			.replace(/^[^/]+(\/)?/, '/')
			.replace(/\?(.*)/, '')
			.replace(/\.json$/, '');
	}

	get methods() {
		return {
			'get': 'GET',
			'post': 'POST',
			'patch': 'PATCH',
			'put': 'PUT',
			'options': 'OPTIONS',
			'delete': 'DELETE'
		};
	}

	isMethod(method, expected = this.methods.get) {
		return (expected instanceof Array ? expected : [expected]).indexOf(method) !== -1;
	}

}

module.exports = new UrlHelper();


/***/ }),
/* 88 */
/***/ (function(module, exports) {

class RegexHelper {

	get guidRegExp() {
		return '[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';
	}

}

module.exports = new RegexHelper();


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (ngModule) => {
	ngModule.provider(__webpack_require__(13), __webpack_require__(90));
};


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

const config = __webpack_require__(21);
const { url:urlHelper } = __webpack_require__(1);
const { Injectable } = __webpack_require__(14);
const InterceptorFactory = __webpack_require__(91);

module.exports = class InterceptorProvider extends Injectable {

	addAction(endpoint, action) {
		const defaultAction = {
			endpoint: null,
			event: '',
			method: urlHelper.methods.get,
			preprocess: null,
			process: null,
			postprocess: null
		};

		Object.keys(defaultAction).forEach((key) => {
			action[key] = action[key] || defaultAction[key];
		});

		return this.safePush(config.endpointCollection, endpoint, action);
	}

	set endpointPrefix(value) {
		config.prefix = value;
	}

	get endpointPrefix() {
		return config.prefix;
	}

	safePush(arr, key, value) {
		arr[key] = arr[key] || [];
		arr[key].push(value);

		return this;
	}

	get $get() {
		return InterceptorFactory;
	}

};


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

const InterceptorService = __webpack_require__(92);

const InterceptorFactory = (...args) => {
	return new InterceptorService(...args);
};

InterceptorFactory.$inject = [
	__webpack_require__(7),
	__webpack_require__(15)
];

module.exports = InterceptorFactory;


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

const { url:urlHelper } = __webpack_require__(1);
const config = __webpack_require__(21);
let _self; // eslint-disable-line consistent-this

module.exports = class InterceptorService {

	constructor(geeService, propertyHistoryService) {
		_self = this;
		this.actions = config.endpointCollection;
		this.geeService = geeService;
		this.propertyHistoryService = propertyHistoryService;
	}

	response(res) {
		_self.handleResponse(angular.copy(res));

		return res;
	}

	handleResponse(res) {
		if (res.config.gee !== false) {
			const url = urlHelper.getUri(res.config.url);

			for (const endpoint in this.actions) {
				if (this.actions[endpoint] && this.actions[endpoint].length) {
					if ((new RegExp(`^${config.prefix}${endpoint}(/)?$`)).test(url)) {
						this.actions[endpoint].forEach((action) => {
							if (urlHelper.isMethod(res.config.method, action.methods || action.method)) {
								this.triggerAction(res, action);
							}
						});
					}
				}
			}
		}
	}

	triggerAction(res, { event, preprocess, process, postprocess }) {
		if (typeof preprocess === 'function') {
			if (preprocess(res.data, res.config.data, this) === false) {
				return;
			}
		}

		if (typeof process === 'function') {
			process(res.data, res.config.data, this);
		} else {
			this.geeService.trigger(event, res.data);
		}

		if (typeof postprocess === 'function') {
			postprocess(res.data, res.config.data, this);
		}
	}

};


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (ngModule) => {
	ngModule.provider(__webpack_require__(15), __webpack_require__(94));
};


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

const { Injectable } = __webpack_require__(14);
const PropertyHistoryFactory = __webpack_require__(95);

module.exports = class PropertyHistoryProvider extends Injectable {

	get $get() {
		return PropertyHistoryFactory;
	}

};


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

const PropertyHistoryService = __webpack_require__(96);

const PropertyHistoryFactory = (...args) => {
	return new PropertyHistoryService(...args);
};

PropertyHistoryFactory.$inject = [];

module.exports = PropertyHistoryFactory;


/***/ }),
/* 96 */
/***/ (function(module, exports) {

const instanceHistories = new WeakMap();
const guidHistories = {};

module.exports = class PropertyHistoryService {

	updateProperty(instance, property, value) {
		this.getPropertyHistory(instance, property).push(value);
	}

	resetPropertyHistory(instance, property) {
		this.getInstanceHistory(instance)[property] = [];
	}

	resetInstanceHistory(instance) {
		const history = this.getInstanceHistory(instance);
		Object.keys(history).forEach((property) => {
			this.resetPropertyHistory(instance, property);
		});
	}

	getInitialValue(instance, property) {
		return this.getPropertyHistory(instance, property)[0];
	}

	getLatestValue(instance, property) {
		const history = this.getPropertyHistory(instance, property);

		if (history.length === 0) {
			return null;
		}

		return history[history.length - 1];
	}

	getPropertyHistory(instance, property) {
		const instanceHistory = this.getInstanceHistory(instance);
		if (!instanceHistory[property]) {
			instanceHistory[property] = [];
		}

		return instanceHistory[property];
	}

	getInstanceHistory(instance) {
		if (!instanceHistories.has(instance)) {
			const { id } = instance;
			if (!guidHistories[id]) {
				guidHistories[id] = {};
			}
			instanceHistories.set(instance, guidHistories[instance.id]);
		}

		return instanceHistories.get(instance);
	}

};


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (ngModule) => {
	__webpack_require__(98)(ngModule);
	__webpack_require__(102)(ngModule);
	__webpack_require__(104)(ngModule);
	__webpack_require__(108)(ngModule);
};


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

const directiveName = __webpack_require__(3);
const controllerFactory = __webpack_require__(99);
const scope = __webpack_require__(100);

module.exports = (ngModule) => {
	const controller = controllerFactory(ngModule);
	const restrict = 'A';

	ngModule.directive(directiveName, __webpack_require__(101)(() => {
		return {
			restrict,
			scope,
			controller
		};
	}));
};


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

const { Injectable } = __webpack_require__(14);
const propertyHistoryService = __webpack_require__(15);

module.exports = (ngModule) => {

	const name = `${__webpack_require__(3)}Ctrl`;

	class ProductCtrl extends Injectable {

		static get $inject() {
			return ['$scope', propertyHistoryService];
		}

		init() {
			this.$scope.$watch('product.qtyOrdered', (...args) => {
				this.onQuantityChange(...args);
			});
		}

		onQuantityChange(newQuantity, oldQuantity) {
			if (newQuantity !== oldQuantity || this.propertyHistoryService.getPropertyHistory(this.$scope.product, 'qtyOrdered').length === 0) {
				this.propertyHistoryService.updateProperty(this.$scope.product, 'qtyOrdered', newQuantity);
			}
		}

	}

	ngModule.controller(name, ProductCtrl);

	return name;
};


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

const directiveName = __webpack_require__(3);

module.exports = {
	product: `=${directiveName}`
};


/***/ }),
/* 101 */
/***/ (function(module, exports) {

module.exports = (directiveDefinition) => {
	const dependencies = [];

	return dependencies.concat(directiveDefinition);
};


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

const directiveName = __webpack_require__(22);

module.exports = (ngModule) => {

	ngModule.directive(directiveName, __webpack_require__(103)(() => {
		return {
			restrict: 'A'
		};
	}));
};


/***/ }),
/* 103 */
/***/ (function(module, exports) {

module.exports = (directiveDefinition) => {
	const dependencies = [];

	return dependencies.concat(directiveDefinition);
};


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

const directiveName = __webpack_require__(23);
const productDirective = __webpack_require__(3);
const scope = __webpack_require__(105);
const linkFactory = __webpack_require__(106);

module.exports = (ngModule) => {
	ngModule.directive(directiveName, __webpack_require__(107)((...args) => {
		return {
			restrict: 'A',
			require: [`^?${productDirective}`],
			scope: scope,
			link: linkFactory(...args)
		};
	}));
};


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

const directiveName = __webpack_require__(23);

module.exports = {
	products: `=?${directiveName}`
};


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

const positionDirective = __webpack_require__(22).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

module.exports = (geeService) => {
	return ($scope, $element, $attrs, $ctrls) => {
		$element.on('click', () => {
			const product = angular.copy($scope.product || $ctrls[0] ? $ctrls[0].$scope.product : null);
			if (product) {
				const position = $element.attr(positionDirective) || $element.closest(`[${positionDirective}]`).attr(positionDirective);
				product.properties = product.properties || {};
				product.properties.position = position;
				geeService.triggerProductClick(product);
			}
		});
	};
};


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (directiveDefinition) => {
	const dependencies = [
		__webpack_require__(7)
	];

	return dependencies.concat(directiveDefinition);
};


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

const directiveName = __webpack_require__(24);
const productDirective = __webpack_require__(3);
const scope = __webpack_require__(109);
const linkFactory = __webpack_require__(110);

module.exports = (ngModule) => {
	ngModule.directive(directiveName, __webpack_require__(111)((...args) => {
		return {
			restrict: 'A',
			require: [`^?${productDirective}`],
			scope: scope,
			link: linkFactory(...args)
		};
	}));
};


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

const directiveName = __webpack_require__(24);

module.exports = {
	products: `=?${directiveName}`
};


/***/ }),
/* 110 */
/***/ (function(module, exports) {

module.exports = (geeService) => {
	return ($scope, $element, $attrs, $ctrls) => {
		$element.on('click', () => {
			const products = $scope.products || $ctrls[0] ? $ctrls[0].$scope.product : null;
			if (products) {
				const productsCopy = angular.copy(products instanceof Array ? products : [products]);
				geeService.triggerRemoveFromCart({
					products: productsCopy,
					list: 'Cart'
				});
			}
		});
	};
};


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (directiveDefinition) => {
	const dependencies = [
		__webpack_require__(7)
	];

	return dependencies.concat(directiveDefinition);
};


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (ngModule) => {
	__webpack_require__(113)(ngModule);
	__webpack_require__(114)(ngModule);
};


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

const interceptor = __webpack_require__(13);

module.exports = (ngModule) => {

	ngModule.config([
		'$httpProvider',
		($httpProvider) => {
			$httpProvider.interceptors.push(interceptor);
		}
	]);
};


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

const interceptor = __webpack_require__(13);
const _actions = __webpack_require__(115);

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
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = [
	__webpack_require__(116),
	__webpack_require__(117),
	__webpack_require__(118),
	__webpack_require__(119),
	__webpack_require__(120),
	__webpack_require__(121),
	__webpack_require__(122),
	__webpack_require__(123),
	__webpack_require__(124),
	__webpack_require__(125)
];


/***/ }),
/* 116 */
/***/ (function(module, exports) {

module.exports = {
	endpoint: '/products',
	event: 'productImpression'
};


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

const { regex:regexHelper } = __webpack_require__(1);

module.exports = {
	endpoint: `/products/${regexHelper.guidRegExp}`,
	event: 'productDetail'
};


/***/ }),
/* 118 */
/***/ (function(module, exports) {

module.exports = {
	endpoint: '/websites/current/crosssells',
	event: 'productImpression',
	preprocess: (response) => {
		response.list = 'Web cross sale';
	}
};


/***/ }),
/* 119 */
/***/ (function(module, exports) {

module.exports = {
	endpoint: '/wishlists',
	event: 'productImpression',
	preprocess: (response) => {
		const products = [];

		(response.wishListCollection || []).forEach((wishList) => {
			(wishList.wishListLineCollection || []).forEach((wishListLine) => {
				products.push(wishListLine);
			});
		});

		response.products = products;
	}
};


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

const { regex:regexHelper } = __webpack_require__(1);

module.exports = {
	endpoint: `/wishlists/${regexHelper.guidRegExp}`,
	event: 'productImpression',
	preprocess: (response) => {
		response.products = response.wishListLineCollection;
	}
};


/***/ }),
/* 121 */
/***/ (function(module, exports) {

module.exports = {
	endpoint: '/sessions/current',
	process: (response, request, { geeService }) => {
		if (response && response.currency && response.currency.currencyCode) {
			geeService.configs.set('currencyCode', response.currency.currencyCode);
		}
	}
};


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

const { url:urlHelper } = __webpack_require__(1);

module.exports = {
	endpoint: '/carts/current/cartlines(/batch)?',
	event: 'addToCart',
	method: urlHelper.methods.post,
	preprocess: (response, request) => {
		response.products = response.cartLines || [angular.copy(response)];
		response.list = '';
		response.products.forEach((product) => {
			product.qtyAdded = request.qtyOrdered || product.qtyOrdered;
		});
	}
};


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

const { url:urlHelper } = __webpack_require__(1);

module.exports = {
	endpoint: '/carts/current',
	event: 'removeFromCart',
	method: urlHelper.methods.patch,
	preprocess: (response, request) => {
		if (response.status !== 'Saved') {
			return false;
		}

		response.products = request.cartLines;

		return true;
	}
};


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

const { url:urlHelper } = __webpack_require__(1);

module.exports = {
	endpoint: '/carts/current',
	event: 'purchase',
	method: urlHelper.methods.patch,
	preprocess: (response, request) => {
		if (response.status !== 'Processing') {
			return false;
		}

		response.products = request.cartLines;

		return true;
	}
};


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

const { url:urlHelper, regex:regexHelper } = __webpack_require__(1);
const qtyOrderedProp = 'qtyOrdered';

module.exports = {
	endpoint: `/carts/current/cartlines/${regexHelper.guidRegExp}?`,
	method: urlHelper.methods.patch,
	process: (response, request, { propertyHistoryService, geeService }) => {
		const originalQty = propertyHistoryService.getInitialValue(response, qtyOrderedProp);
		const actualQty = response.qtyOrdered;
		const added = originalQty < actualQty;
		const qtyProp = `qty${added ? 'Added' : 'Removed'}`;

		geeService.trigger(added ? 'addToCart' : 'removeFromCart', {
			product: angular.copy(response),
			list: '',
			[qtyProp]: Math.abs(originalQty - actualQty)
		});

		propertyHistoryService.resetPropertyHistory(response, qtyOrderedProp);
		propertyHistoryService.updateProperty(response, qtyOrderedProp, actualQty);
	}
};


/***/ })
/******/ ]);