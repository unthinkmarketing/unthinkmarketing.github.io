angular.module('pagespeed',['ngRoute','mgcrea.ngStrap','ngCookies'])
.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
	
	$routeProvider
	.when('/',{
		templateUrl:'/views/search.html',
		controller:'mainctrl'
	})
	.when('/home/',{
		templateUrl:'/views/home.html',
		controller:'homectrl'
	})
	.when('/success/',{
		templateUrl:'/views/success.html',
		//controller:'homectrl'
	})
	 .when('/amount/',{
		templateUrl:'/views/amount.html',
		controller:'amountctrl'
	}) 
	 .otherwise({
		
		redirectTo:'/'
	}) 
	
}])
