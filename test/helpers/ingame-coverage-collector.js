window.__webfun_coverage__ = window.__webfun_coverage__ || {};
window.__webfun_coverage__.zones = window.__webfun_coverage__.zones || {};
window.__webfun_coverage__.actions = window.__webfun_coverage__.actions || {};

const originalComplete = window.__karma__.complete;
window.__karma__.complete = result => {
	result = result || {};
	result.webFunCoverage = window.__webfun_coverage__;
	originalComplete(result);
};
