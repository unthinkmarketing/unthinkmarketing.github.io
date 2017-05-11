var baseurl="http://ec2-54-213-173-44.us-west-2.compute.amazonaws.com:9500/";
angular.module('pagespeed', ['ngRoute'])
.controller('mainctrl',['$scope','$http','$location','$cookies',function($scope,$http,$location,$cookies,$localStorage,$interval){
	$scope.submit=function(data){
		if(data!=undefined){
			var text_showing=["Analyzing..."+data.url,"Analyzing...Images","Analyzing...Css","Analyzing...JavaScript","Analyzing...HTML","Analyzing...Content","Analyzing...Plugins","Finishing...Up","Analyzing...pls wait"];
			var i=0;
			var myVar = setInterval(function(){ myTimer() }, 1200);
			function myTimer(){
				document.getElementById("demo").innerHTML = text_showing[i];
				i++;
				if(i==text_showing.length){
					clearInterval(myVar);
				}
			}
		}
		$scope.mbody=false;
		if(data == undefined || data.url == "")
		{
			$scope.top_toggle="margin-top:55px;"
			$scope.over_view=false;
			$scope.mbody=false;
			$scope.message="Please Enter URL";
			localStorage.clear('path')
		}
		else
		{
			var dd=data.url;
			$scope.imageURL=data.url;
			$scope.message='';
			$scope.mbody=true;
			$http.get(baseurl+'api/getDetails?data='+data.url)
			.success(function(response)
			{
				console.log(response)
				if(response=="wrongURL"){
					$scope.message = "Please Enter a Valid URL";
					$scope.mbody=false;
				}
				else if(response=="Timeout"){
					$scope.message = "Please Try Again";
					$scope.mbody=false;
				}
				else{
					$scope.mbody=false;
					localStorage.setItem("response",JSON.stringify(response));
					$location.path('/home');
				}
			});
		}
	 }
}]);
//imageService
angular.module('pagespeed')
.service('ImageArrayBufferToBase64Service', function(){
       this._arrayBufferToBase64 = function(imageDataParam) {
            var binary = '';
			var bytes = new Uint8Array( imageDataParam );
			var len = bytes.byteLength;
			for (var i = 0; i < len; i++) {
				binary += String.fromCharCode( bytes[ i ] );
			}
			return window.btoa( binary );
          }
 });
//homectrl
angular.module('pagespeed')
.controller('homectrl',['$scope','ImageArrayBufferToBase64Service','$parse','$http','$compile',function($scope,ImageArrayBufferToBase64Service,$parse,$http,$location,$compile)
{
	$scope.headerCompiled=false;
	$scope.homeView=function()
	{
		localStorage.removeItem("removCart");
		var response = JSON.parse(localStorage.getItem("response"));
		var imageData = JSON.parse(response.screenshot);
		
		$scope.imageBase64 = ImageArrayBufferToBase64Service._arrayBufferToBase64(imageData);
		$scope.imgData = $scope.imageBase64;	
		var mainData = response.mainData;
		var d =new Date();
		$scope.reportedDate = d.toDateString()+"-	"+d.getHours()+"H:	"+d.getMinutes()+"Min:	"+d.getSeconds()+"Sec";
		var yslow = response.yslow;
		var yres=yslow.g;
		$scope.yslowscore = yslow.o;
		$scope.presentURL= yslow.u;
		var loadTime = yslow.lt/1000;
		$scope.pageloadtime =  loadTime.toFixed(1);
		var pagespeed = response.pagespeed;
		$scope.pagespeedscore = pagespeed.pageStats.overallScore;
		
		/* pagespeed */
		var total = 0;
		var pagespeedArray = [];
		var myE2 = angular.element(document.querySelector('#pagespeedResult'));
		
		for(var i=0;i<pagespeed.rules.length;i++)
		{
			var amount;
			
			if(pagespeed.rules[i].name=="Leverage browser caching" || pagespeed.rules[i].name=="Enable compression" || pagespeed.rules[i].name=="Defer parsing of JavaScript"){}
			else{
				if(pagespeed.rules[i].score!=100){
					if(pagespeed.rules[i].name=="Avoid bad requests"){
						amount=5;
					}
					else if(pagespeed.rules[i].name=="Avoid a character set in the meta tag"){
						amount=5;
					}
					else if(pagespeed.rules[i].name=="Avoid CSS @import"){
						amount=5;
					}
					else if(pagespeed.rules[i].name=="Avoid landing page redirects"){
						amount=5;
					}
					else if(pagespeed.rules[i].name=="Enable Keep-Alive"){
						amount=5;
					}
					else if(pagespeed.rules[i].name=="Inline Small CSS"){
						amount=5;
					}
					else if(pagespeed.rules[i].name=="Inline Small JavaScript"){
						amount=5;
					}
					else if(pagespeed.rules[i].name=="Minify CSS"){
						amount=10;
					}
					else if(pagespeed.rules[i].name=="Minify HTML"){
						amount=10;
					}
					else if(pagespeed.rules[i].name=="Minify JavaScript"){
						amount=10;
					}
					else if(pagespeed.rules[i].name=="Minimize redirects"){
						amount=5;
					}
					else if(pagespeed.rules[i].name=="Minimize request size"){
						amount=5;
					}
					else if(pagespeed.rules[i].name=="Optimize images"){
						amount=20;
					}
					else if(pagespeed.rules[i].name=="Optimize the order of styles and scripts"){
						amount=5;
					}
					else if(pagespeed.rules[i].name=="Put CSS in the document head"){
						amount=5;
					}
					else if(pagespeed.rules[i].name=="Remove query strings from static resources"){
						amount=5;
					}
					else if(pagespeed.rules[i].name=="Serve resources from a consistent UR"){
						amount=5;
					}
					else if(pagespeed.rules[i].name=="Serve scaled images"){
						amount=5;
					}
					else if(pagespeed.rules[i].name=="Specify a cache validator"){
						amount=5;
					}
					else if(pagespeed.rules[i].name=="Specify a Vary: Accept-Encoding header"){
						amount=5;
					}
					else if(pagespeed.rules[i].name=="Specify a character set"){
						amount=5;
					}
					else if(pagespeed.rules[i].name=="Specify image dimensions"){
						amount=20;
					}
					else if(pagespeed.rules[i].name=="Combine images into CSS sprites"){
						amount=5;
					}
					else if(pagespeed.rules[i].name=="Prefer asynchronous resources"){
						amount=5;
					}
					if(pagespeed.rules[i].score>=0 && pagespeed.rules[i].score<50){
						pagespeedArray.push({"name":pagespeed.rules[i].name,"score":pagespeed.rules[i].score,"amount":amount,"shortName":pagespeed.rules[i].shortName});
					var result ='<div class="panel-heading accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion1" href="#p_'+i+'">'+'<h5 class="panel-title sample" data-toggle="tooltip" data-tooltip="'+pagespeed.rules[i].name+'">'+'<a class="tb-anch accordion-heading col-md-6 col-lg-7 col-sm-8 col-xs-10 lineheight">'+'<span class="ng-binding">'+pagespeed.rules[i].name+'</span>'+'</a>'+'<button class="button_red">'+pagespeed.rules[i].score+'</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+pagespeed.rules[i].score+','+"'"+pagespeed.rules[i].name+"'"+','+amount+","+"'"+pagespeed.rules[i].shortName+"'"+')"  class="pull-right addCartClass" ng-show="'+pagespeed.rules[i].shortName+'.show">'+'Add  Item</button>'+'<button id="btncart_'+i+'" ng-click="toggleActive('+pagespeed.rules[i].score+','+"'"+pagespeed.rules[i].name+"'"+','+amount+","+"'"+pagespeed.rules[i].shortName+"'"+')"  class="pull-right removeCart" ng-hide="'+pagespeed.rules[i].shortName+'.hide">'+'Remove Item</button>'+'</h5>'+'</div>'+'<div id="p_'+i+'" class="panel-collapse collapse">'+'<div class="panel-body panel-data">'+'<div>'+'<p>'+pagespeed.rules[i].warnings+'</p>'+'</div>'+'</div>'+'</div>'
					myE2.append(result); 
					}
					else if(pagespeed.rules[i].score>=50 && pagespeed.rules[i].score<90){
						pagespeedArray.push({"name":pagespeed.rules[i].name,"score":pagespeed.rules[i].score,"amount":amount,"shortName":pagespeed.rules[i].shortName});
					var result ='<div class="panel-heading accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion1" href="#p_'+i+'">'+'<h5 class="panel-title sample" data-toggle="tooltip" data-tooltip="'+pagespeed.rules[i].name+'">'+'<a class="tb-anch accordion-heading col-md-6 col-lg-7 col-sm-8 col-xs-10 lineheight">'+'<span class="ng-binding">'+pagespeed.rules[i].name+'</span>'+'</a>'+'<button class="button_orange">'+pagespeed.rules[i].score+'</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+pagespeed.rules[i].score+','+"'"+pagespeed.rules[i].name+"'"+','+amount+","+"'"+pagespeed.rules[i].shortName+"'"+')"  class="pull-right addCartClass" ng-show="'+pagespeed.rules[i].shortName+'.show">'+'Add  Item</button>'+'<button id="btncart_'+i+'" ng-click="toggleActive('+pagespeed.rules[i].score+','+"'"+pagespeed.rules[i].name+"'"+','+amount+","+"'"+pagespeed.rules[i].shortName+"'"+')"  class="pull-right removeCart" ng-hide="'+pagespeed.rules[i].shortName+'.hide">'+'Remove Item</button>'+'</h5>'+'</div>'+'<div id="p_'+i+'" class="panel-collapse collapse">'+'<div class="panel-body panel-data">'+'<div>'+'<p>'+pagespeed.rules[i].warnings+'</p>'+'</div>'+'</div>'+'</div>'
					myE2.append(result); 
					}
					else if(pagespeed.rules[i].score>=90 && pagespeed.rules[i].score<100){
						pagespeedArray.push({"name":pagespeed.rules[i].name,"score":pagespeed.rules[i].score,"amount":amount,"shortName":pagespeed.rules[i].shortName});
					var result ='<div class="panel-heading accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion1" href="#p_'+i+'">'+'<h5 class="panel-title sample" data-toggle="tooltip" data-tooltip="'+pagespeed.rules[i].name+'">'+'<a class="tb-anch accordion-heading col-md-6 col-lg-7 col-sm-8 col-xs-10 lineheight">'+'<span class="ng-binding">'+pagespeed.rules[i].name+'</span>'+'</a>'+'<button class="button_green">'+pagespeed.rules[i].score+'</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+pagespeed.rules[i].score+','+"'"+pagespeed.rules[i].name+"'"+','+amount+","+"'"+pagespeed.rules[i].shortName+"'"+')"  class="pull-right addCartClass" ng-show="'+pagespeed.rules[i].shortName+'.show">'+'Add  Item</button>'+'<button id="btncart_'+i+'" ng-click="toggleActive('+pagespeed.rules[i].score+','+"'"+pagespeed.rules[i].name+"'"+','+amount+","+"'"+pagespeed.rules[i].shortName+"'"+')"  class="pull-right removeCart" ng-hide="'+pagespeed.rules[i].shortName+'.hide">'+'Remove Item</button>'+'</h5>'+'</div>'+'<div id="p_'+i+'" class="panel-collapse collapse">'+'<div class="panel-body panel-data">'+'<div>'+'<p>'+pagespeed.rules[i].warnings+'</p>'+'</div>'+'</div>'+'</div>'
					myE2.append(result); 
					}
					
				}
				else if(pagespeed.rules[i].score == 100){
					var result = '<div class="panel-heading accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion1" ng-href="#p_'+i+'">'+'<h5 class="panel-title sample">'+'<a class="tb-anch accordion-heading col-md-6 col-lg-7 col-sm-8 col-xs-10 lineheight">'+'<span class="ng-binding">'+pagespeed.rules[i].name+'</span>'+'</a>'+'<button class="button_green">'+pagespeed.rules[i].score+'</button>'+'</h5>'+'</div>'+'<div id="p_'+i+'" class="panel-collapse collapse">'+'<div class="panel-body panel-data">'+'<div>'+'<p>'+'You scored 100% on this recommendation - nothing to do here!'+'</p>'+'</div>'+'</div>'+'</div>';
					myE2.append(result); 
				}
								
			}				
		}
		angular.element(myE2).injector().invoke(function($compile){
			var scope=angular.element(myE2).scope();
			$compile(myE2.contents())(scope);
		}); 
		/* End of Pagespeed */
		
		/*Start Yslow*/
		for(var key in yres) 
		{
			if(key == "ycdn")
			{
				$scope.ycdn = "Use a Content Delivery Network (CDN)";
				if(yres[key].score >=0 && yres[key].score< 50)
				{
					var amount=5;
					pagespeedArray.push({"name":"Use a Content Delivery Network (CDN)","score":yres[key].score,"amount":amount,"shortName":"yres"});
					var myE2 = angular.element(document.querySelector('#ycdnCart'));
					$scope.ycdnColor="background-color:#f36a5a;color:white";
					$scope.ycdnScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Use a Content Delivery Network (CDN)'"+','+amount+","+"'yres'"+')"  class="pull-right removeCart" ng-hide="yres.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Use a Content Delivery Network (CDN)'"+','+amount+","+"'yres'"+')"  class="pull-right addCartClass" ng-show="yres.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					}); 
				}
				else if(yres[key].score>=50 && yres[key].score<75)
				{
					var amount=5;
					pagespeedArray.push({"name":"Use a Content Delivery Network (CDN)","score":yres[key].score,"amount":amount,"shortName":"yres"});
					var myE2 = angular.element(document.querySelector('#ycdnCart'));
					$scope.ycdnColor="background-color:#5C9BD1;color:white";
					$scope.ycdnScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Use a Content Delivery Network (CDN)'"+','+amount+","+"'yres'"+')"  class="pull-right removeCart" ng-hide="yres.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Use a Content Delivery Network (CDN)'"+','+amount+","+"'yres'"+')"  class="pull-right addCartClass" ng-show="yres.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					}); 
				}
				else if(yres[key].score>=75 && yres[key].score<90)
				{
					var amount=5;
					pagespeedArray.push({"name":"Use a Content Delivery Network (CDN)","score":yres[key].score,"amount":amount,"shortName":"yres"});
					var myE2 = angular.element(document.querySelector('#ycdnCart'));
					$scope.ycdnColor="background-color:#5C9BD1;color:white";
					$scope.ycdnScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Use a Content Delivery Network (CDN)'"+','+amount+","+"'yres'"+')"  class="pull-right removeCart" ng-hide="yres.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Use a Content Delivery Network (CDN)'"+','+amount+","+"'yres'"+')"  class="pull-right addCartClass" ng-show="yres.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=90 && yres[key].score<100)
				{
					var amount=5;
					pagespeedArray.push({"name":"Use a Content Delivery Network (CDN)","score":yres[key].score,"amount":amount,"shortName":"yres"});
					var myE2 = angular.element(document.querySelector('#ycdnCart'));
					$scope.ycdnColor="background-color:#4DB3A2;color:white";
					$scope.ycdnScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Use a Content Delivery Network (CDN)'"+','+amount+","+"'yres'"+')"  class="pull-right removeCart" ng-hide="yres.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Use a Content Delivery Network (CDN)'"+','+amount+","+"'yres'"+')"  class="pull-right addCartClass" ng-show="yres.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score == 100)
				{
					$scope.ycdnColor="background-color:#4DB3A2;color:white";
					$scope.ycdnScore=yres[key].score;
				}
				if(yres[key].components.length!=0)
				{
					$("#ycdnHeading").append(yslow.g.ycdn.message.replace('<a href="/dashboard.html#prefs-modal">',''));
					considerFix_p_c1=document.getElementById("considerFix_p_c1");
					for(var i=0;i<yres[key].components.length;i++)
					{
						if(yres[key].components[i]!=undefined)
						{
							considerFix_p_c1.innerHTML = considerFix_p_c1.innerHTML+"<a href="+yres[key].components[i]+" target='_blank'>"+"<li>"+yres[key].components[i]+"</a>";
						}
					}
				}
				else
				{
					$("#ycdnHeading").append("<p style='color:black'>You scored 100% on this recommendation - nothing to do here!</p>");
				}
				considerFix_p_c1.innerHTML=considerFix_p_c1.innerHTML;
			}
			if(key == "ycompress")
			{
				$scope.ycompress = "Compress components with gzip";
				if(yres[key].score>=0 && yres[key].score<50)
				{ 
					var myE2 = angular.element(document.querySelector('#ycompressCart'));
					$scope.ycompressColor="background-color:#f36a5a;color:white";
					$scope.ycompressScore=yres[key].score;
					/*var amount=15;
					pagespeedArray.push({"name":"Compress components with gzip","score":yres[key].score,"amount":amount,"shortName":"ycompress1"});
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Compress components with gzip'"+','+amount+","+"'ycompress1'"+')"  class="pull-right removeCart" ng-hide="ycompress1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Compress components with gzip'"+','+amount+","+"'ycompress1'"+')"  class="pull-right addCartClass" ng-show="ycompress1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});*/ 
				}
				else if(yres[key].score>=50 && yres[key].score<75)
				{
					var myE2 = angular.element(document.querySelector('#ycompressCart'));
					$scope.ycompressColor="background-color:#5C9BD1;color:white";
					$scope.ycompressScore=yres[key].score;
					/*var amount=12;
					pagespeedArray.push({"name":"Compress components with gzip","score":yres[key].score,"amount":amount,"shortName":"ycompress1"});
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Compress components with gzip'"+','+amount+","+"'ycompress1'"+')"  class="pull-right removeCart" ng-hide="ycompress1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Compress components with gzip'"+','+amount+","+"'ycompress1'"+')"  class="pull-right addCartClass" ng-show="ycompress1.show">'+'Add Item</button>';
					myE2.append(result); 
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});*/
				}
				else if(yres[key].score>=75 && yres[key].score<90)
				{
					var myE2 = angular.element(document.querySelector('#ycompressCart'));
					$scope.ycompressColor="background-color:#5C9BD1;color:white";
					$scope.ycompressScore=yres[key].score;
					/*var amount=10;
					pagespeedArray.push({"name":"Compress components with gzip","score":yres[key].score,"amount":amount,"shortName":"ycompress1"});
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Compress components with gzip'"+','+amount+","+"'ycompress1'"+')" class="pull-right removeCart" ng-hide="ycompress1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Compress components with gzip'"+','+amount+","+"'ycompress1'"+')" class="pull-right addCartClass" ng-show="ycompress1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});*/
				}
				else if(yres[key].score>=90 && yres[key].score<100)
				{
					var myE2 = angular.element(document.querySelector('#ycompressCart'));
					$scope.ycompressColor="background-color:#4DB3A2;color:white";
					$scope.ycompressScore=yres[key].score;
					/*var amount=5;
					pagespeedArray.push({"name":"Compress components with gzip","score":yres[key].score,"amount":amount,"shortName":"ycompress1"});
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Compress components with gzip'"+','+amount+","+"'ycompress1'"+')"  class="pull-right removeCart" ng-hide="ycompress1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Compress components with gzip'"+','+amount+","+"'ycompress1'"+')"  class="pull-right addCartClass" ng-show="ycompress1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});*/
				}
				else if(yres[key].score==100)
				{
					$scope.ycompressColor="background-color:#4DB3A2;color:white";
					$scope.ycompressScore=yres[key].score;
				}
				if(yres[key].components.length!=0)
				{
					$("#ycompressText").append(yslow.g.ycompress.message);
					considerFix_p_c2=document.getElementById("considerFix_p_c2");
					for(var i=0;i<yres[key].components.length;i++)
					{
						if(yres[key].components[i]!=undefined)
						{
							considerFix_p_c2.innerHTML = considerFix_p_c2.innerHTML+"<a href="+yres[key].components[i]+" target='_blank'>"+"<li>"+yres[key].components[i]+"</a>";
						}
					}
				}
				else
				{
					$("#ycompressText").append("<p style='color:black'>You scored 100% on this recommendation - nothing to do here!</p>");
				}
				considerFix_p_c2.innerHTML=considerFix_p_c2.innerHTML;
			}
			 if(key == "ycookiefree")
			 {
				 $scope.ycookiefree = "Use cookie-free domains";
				if(yres[key].score>=0 && yres[key].score<50)
				{
					$scope.ycookiefreeColor="background-color:#f36a5a;color:white";
					 $scope.ycookiefreeScore=yres[key].score;
					/*  var myE2 = angular.element(document.querySelector('#ycookiefreeCart'));
					var amount=15;
					 pagespeedArray.push({"name":"Use cookie-free domains","score":yres[key].score,"amount":amount,"shortName":"ycookiefree1"});
					 var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Use cookie-free domains'"+','+amount+","+"'ycookiefree1'"+')"  class="pull-right removeCart" ng-hide="ycookiefree1.hide">'+
					 'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Use cookie-free domains'"+','+amount+","+"'ycookiefree1'"+')"  class="pull-right addCartClass" ng-show="ycookiefree1.show">'+'Add Item</button>';
					 myE2.append(result); 
					angular.element(myE2).injector().invoke(function($compile){
						 var scope=angular.element(myE2).scope();
						 $compile(myE2.contents())(scope);
					}); */
				}
				else if(yres[key].score>=50 && yres[key].score<75)
				{
					$scope.ycookiefreeColor="background-color:#5C9BD1;color:white";
					$scope.ycookiefreeScore=yres[key].score;
					/* var amount=5;
					pagespeedArray.push({"name":"Use cookie-free domains","score":yres[key].score,"amount":amount,"shortName":"ycookiefree1"})
					var myE2 = angular.element(document.querySelector('#ycookiefreeCart'));
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Use cookie-free domains'"+','+amount+","+"'ycookiefree1'"+')"  class="pull-right removeCart" ng-hide="ycookiefree1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Use cookie-free domains'"+','+amount+","+"'ycookiefree1'"+')"  class="pull-right addCartClass" ng-show="ycookiefree1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					}); */
				}
				else if(yres[key].score>=75 && yres[key].score<90)
				{
					$scope.ycookiefreeColor="background-color:#5C9BD1;color:white";
					$scope.ycookiefreeScore=yres[key].score;
					var amount=5;
					/* pagespeedArray.push({"name":"Use cookie-free domains","score":yres[key].score,"amount":amount,"shortName":"ycookiefree1"})
					var myE2 = angular.element(document.querySelector('#ycookiefreeCart'));
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Use cookie-free domains'"+','+amount+","+"'ycookiefree1'"+')"  class="pull-right removeCart" ng-hide="ycookiefree1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Use cookie-free domains'"+','+amount+","+"'ycookiefree1'"+')"  class="pull-right addCartClass" ng-show="ycookiefree1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					}); */
				}
				else if(yres[key].score>=90 && yres[key].score<100)
				{
					$scope.ycookiefreeColor="background-color:#4DB3A2;color:white";
					$scope.ycookiefreeScore=yres[key].score;
					/* var amount=5;
					pagespeedArray.push({"name":"Use cookie-free domains","score":yres[key].score,"amount":amount,"shortName":"ycookiefree1"})
					var myE2 = angular.element(document.querySelector('#ycookiefreeCart'));
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Use cookie-free domains'"+','+amount+','+"'ycookiefree1'"+')"  class="pull-right removeCart" ng-hide="ycookiefree1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Use cookie-free domains'"+','+amount+','+"'ycookiefree1'"+')"  class="pull-right addCartClass" ng-show="ycookiefree1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					}); */
				}
				else if(yres[key].score==100)
				{
					$scope.ycookiefreeColor="background-color:#4DB3A2;color:white";
					$scope.ycookiefreeScore=yres[key].score;
				}
				if(yres[key].components.length!=0)
				{
					$("#ycookiefreeText").append(yslow.g.ycookiefree.message);
					considerFix_p_c3=document.getElementById("considerFix_p_c3");
					for(var i=0;i<yres[key].components.length;i++)
					{
						if(yres[key].components[i]!=undefined)
						{
							considerFix_p_c3.innerHTML = considerFix_p_c3.innerHTML+"<a href="+yres[key].components[i]+" target='_blank'>"+"<li>"+yres[key].components[i]+"</a>";
						}
					}
				}
				else
				{
					$("#ycookiefreeText").append("<p style='color:black'>You scored 100% on this recommendation - nothing to do here!</p>");
				}
				considerFix_p_c3.innerHTML=considerFix_p_c3.innerHTML;
			}
										 
			if(key == "ydns")
			{
				$scope.ydns = "Reduce DNS lookups";
				if(yres[key].score>=0 && yres[key].score<50)
				{
					var amount=5;
					pagespeedArray.push({"name":"Reduce DNS lookups","score":yres[key].score,"amount":amount,"shortName":"ydns1"});
					var myE2 = angular.element(document.querySelector('#ydnsCart'));
					$scope.ydnsColor="background-color:#f36a5a;color:white";
					$scope.ydnsScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Reduce DNS lookups'"+','+amount+","+"'ydns1'"+')"  class="pull-right removeCart" ng-hide="ydns1.hide">'+
					'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Reduce DNS lookups'"+','+amount+","+"'ydns1'"+')"  class="pull-right addCartClass" ng-show="ydns1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=50 && yres[key].score<75)
				{
					var amount=5;
					pagespeedArray.push({"name":"Reduce DNS lookups","score":yres[key].score,"amount":amount,"shortName":"ydns1"});
					var myE2 = angular.element(document.querySelector('#ydnsCart'));
					$scope.ydnsColor="background-color:#5C9BD1;color:white";
					$scope.ydnsScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Reduce DNS lookups'"+','+amount+","+"'ydns1'"+')"  class="pull-right removeCart" ng-hide="ydns1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Reduce DNS lookups'"+','+amount+","+"'ydns1'"+')"  class="pull-right addCartClass" ng-show="ydns1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=75 && yres[key].score<90)
				{
					var amount=5;
					pagespeedArray.push({"name":"Reduce DNS lookups","score":yres[key].score,"amount":amount,"shortName":"ydns1"});
					var myE2 = angular.element(document.querySelector('#ydnsCart'));
					$scope.ydnsColor="background-color:#5C9BD1;color:white";
					$scope.ydnsScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Reduce DNS lookups'"+','+amount+","+"'ydns1'"+')"  class="pull-right removeCart" ng-hide="ydns1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Reduce DNS lookups'"+','+amount+","+"'ydns1'"+')"  class="pull-right addCartClass" ng-show="ydns1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=90 && yres[key].score<100)
				{
					var amount=5;
					pagespeedArray.push({"name":"Reduce DNS lookups","score":yres[key].score,"amount":amount,"shortName":"ydns1"});
					var myE2 = angular.element(document.querySelector('#ydnsCart'));
					$scope.ydnsColor="background-color:#4DB3A2;color:white";
					$scope.ydnsScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Reduce DNS lookups'"+','+amount+","+"'ydns1'"+')"  class="pull-right removeCart" ng-hide="ydns1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Reduce DNS lookups'"+','+amount+","+"'ydns1'"+')"  class="pull-right addCartClass" ng-show="ydns1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					}); 
				}
				else if(yres[key].score == 100)
				{
					$scope.ydnsColor="background-color:#4DB3A2;color:white";
					$scope.ydnsScore=yres[key].score;
				}
				if(yres[key].components.length!=0)
				{
					$("#ydnText").append(yslow.g.ydns.message);
					considerFix_p_c4=document.getElementById("considerFix_p_c4");
					for(var i=0;i<yres[key].components.length;i++)
					{
						if(yres[key].components[i]!=undefined)
						{
							considerFix_p_c4.innerHTML = considerFix_p_c4.innerHTML+"<li>"+yres[key].components[i];
						}
					}
				}
				else
				{
					$("#ydnsText").append("<p style='color:black'>You scored 100% on this recommendation - nothing to do here!</p>");
				}
				considerFix_p_c4.innerHTML=considerFix_p_c4.innerHTML;
			}
			if(key == "ydupes")
			{
				$scope.ydupes = "Remove duplicate JavaScript and CSS";
				if(yres[key].score>=0 && yres[key].score<50)
				{
					var amount=5;
					pagespeedArray.push({"name":"Remove duplicate JavaScript and CSS","score":yres[key].score,"amount":amount,"shortName":"ydupes1"});
					var myE2 = angular.element(document.querySelector('#ydnsCart'));
					$scope.ydupesColor="background-color:#f36a5a;color:white";
					$scope.ydupesScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Remove duplicate JavaScript and CSS'"+','+amount+","+"'ydupes1'"+')"  class="pull-right removeCart" ng-hide="ydupes1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Remove duplicate JavaScript and CSS'"+','+amount+","+"'ydupes1'"+')"  class="pull-right addCartClass" ng-show="ydupes1.show">'+'Add Item</button>';
					myE2.append(result); 
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					}); 
				}
				else if(yres[key].score>=50 && yres[key].score<75)
				{
					var amount=5;
					pagespeedArray.push({"name":"Remove duplicate JavaScript and CSS","score":yres[key].score,"amount":amount,"shortName":"ydupes1"})
					var myE2 = angular.element(document.querySelector('#ydnsCart'));
					$scope.ydupesColor="background-color:#5C9BD1;color:white";
					$scope.ydupesScore=yres[key].score;var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Remove duplicate JavaScript and CSS'"+','+amount+","+"'ydupes1'"+')"  class="pull-right removeCart" ng-hide="ydupes1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Remove duplicate JavaScript and CSS'"+','+amount+","+"'ydupes1'"+')"  class="pull-right addCartClass" ng-show="ydupes1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=75 && yres[key].score <90)
				{
					var amount=5;
					pagespeedArray.push({"name":"Remove duplicate JavaScript and CSS","score":yres[key].score,"amount":amount,"shortName":"ydupes1"});
					var myE2 = angular.element(document.querySelector('#ydnsCart'));
					$scope.ydupesColor="background-color:#5C9BD1;color:white";
					$scope.ydupesScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Remove duplicate JavaScript and CSS'"+','+amount+","+"'ydupes1'"+')"  class="pull-right removeCart" ng-hide="ydupes1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Remove duplicate JavaScript and CSS'"+','+amount+","+"'ydupes1'"+')"  class="pull-right addCartClass" ng-show="ydupes1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=90 && yres[key].score <100)
				{
					var amount=5;
					pagespeedArray.push({"name":"Remove duplicate JavaScript and CSS","score":yres[key].score,"amount":amount,"shortName":"ydupes1"});
					var myE2 = angular.element(document.querySelector('#ydnsCart'));
					$scope.ydupesColor="background-color:#4DB3A2;color:white";
					$scope.ydupesScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Remove duplicate JavaScript and CSS'"+','+amount+","+"'ydupes1'"+')"  class="pull-right removeCart" ng-hide="ydupes1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Remove duplicate JavaScript and CSS'"+','+amount+","+"'ydupes1'"+')"  class="pull-right addCartClass" ng-show="ydupes1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score == 100)
				{
					$scope.ydupesColor="background-color:#4DB3A2;color:white";
					$scope.ydupesScore=yres[key].score;
				}
				if(yres[key].components.length!=0)
				{
					$("#ydupeHeading").append(yslow.g.ydupes.message);
					considerFix_p_c5=document.getElementById("considerFix_p_c5");
					for(var i=0;i<yres[key].components.length;i++)
					{
						if(yres[key].components[i]!=undefined)
						{
							considerFix_p_c5.innerHTML = considerFix_p_c5.innerHTML+"<li>"+yres[key].components[i];
						}
					}
				}
				else
				{
					$("#ydupeHeading").append("<p style='color:black'>You scored 100% on this recommendation - nothing to do here!</p>");
				}
				considerFix_p_c5.innerHTML=considerFix_p_c5.innerHTML;
			}
			if(key == "yetags")
			{
				$scope.yetags = "Configure entity tags (ETags)";
				if(yres[key].score>=0 && yres[key].score<50)
				{
					var amount=5;
					pagespeedArray.push({"name":"Configure entity tags (ETags)","score":yres[key].score,"amount":amount,"shortName":"yetags1"});
					var myE2 = angular.element(document.querySelector('#yetagsCart'));
					$scope.yetagsColor="background-color:#f36a5a;color:white";
					$scope.yetagsScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Configure entity tags (ETags)'"+','+amount+","+"'yetags1'"+')"  class="pull-right removeCart" ng-hide="yetags1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Configure entity tags (ETags)'"+','+amount+","+"'yetags1'"+')"  class="pull-right addCartClass" ng-show="yetags1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score<=50 && yres[key].score<75)
				{
					var amount=5;
					pagespeedArray.push({"name":"Configure entity tags (ETags)","score":yres[key].score,"amount":amount,"shortName":"yetags1"});
					var myE2 = angular.element(document.querySelector('#yetagsCart'));
					$scope.yetagsColor="background-color:#5C9BD1;color:white";
					$scope.yetagsScore=yres[key].score;var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Configure entity tags (ETags)'"+','+amount+","+"'yetags1'"+')"  class="pull-right removeCart" ng-hide="yetags1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Configure entity tags (ETags)'"+','+amount+","+"'yetags1'"+')"  class="pull-right addCartClass" ng-show="yetags1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score<=75 && yres[key].score <90)
				{
					var amount=5;
					pagespeedArray.push({"name":"Configure entity tags (ETags)","score":yres[key].score,"amount":amount,"shortName":"yetags1"});
					var myE2 = angular.element(document.querySelector('#yetagsCart'));
					$scope.yetagsColor="background-color:#5C9BD1;color:white";$scope.yetagsScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Configure entity tags (ETags)'"+','+amount+","+"'yetags1'"+')"  class="pull-right removeCart" ng-hide="yetags1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Configure entity tags (ETags)'"+','+amount+","+"'yetags1'"+')"  class="pull-right addCartClass" ng-show="yetags1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score<=90 && yres[key].score <100)
				{
					var amount=5
					pagespeedArray.push({"name":"Configure entity tags (ETags)","score":yres[key].score,"amount":amount,"shortName":"yetags1"});
					var myE2 = angular.element(document.querySelector('#yetagsCart'));
					$scope.yetagsColor="background-color:#4DB3A2;color:white";
					$scope.yetagsScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Configure entity tags (ETags)'"+','+amount+","+"'yetags1'"+')"  class="pull-right removeCart" ng-hide="yetags1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Configure entity tags (ETags)'"+','+amount+","+"'yetags1'"+')"  class="pull-right addCartClass" ng-show="yetags1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score == 100)
				{
					$scope.yetagsColor="background-color:#4DB3A2;color:white";
					$scope.yetagsScore=yres[key].score
				}
				if(yres[key].components.length!=0)
				{
					$("#yetagsHeading").append(yslow.g.yetags.message);
					considerFix_p_c6=document.getElementById("considerFix_p_c6");
					for(var i=0;i<yres[key].components.length;i++)
					{
						if(yres[key].components[i]!=undefined)
						{
							considerFix_p_c6.innerHTML = considerFix_p_c6.innerHTML+"<a href="+yres[key].components[i]+" target='_blank'>"+"<li>"+yres[key].components[i]+"</a>";
						}
					}
				}
				else
				{
					$("#yetagsHeading").append("<p style='color:black'>You scored 100% on this recommendation - nothing to do here!</p>")
				}
				considerFix_p_c6.innerHTML=considerFix_p_c6.innerHTML;
			}
			if(key == "yexpires")
			{
				$scope.yexpires = "Add Expires headers";
				if(yres[key].score>=0 && yres[key].score<50)
				{
					//var myE2 = angular.element(document.querySelector('#yexpiresCart'));
					$scope.yexpiresColor="background-color:#f36a5a;color:white";
					$scope.yexpiresScore=yres[key].score;
					console.log(yres[key].score+"sdasdajkgsdagbsadgjsdag")
					/*var amount=15;
					pagespeedArray.push({"name":"Add Expires headers","score":yres[key].score,"amount":amount,"shortName":"yexpires1"});
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Add Expires headers'"+','+amount+","+"'yexpires1'"+')"  class="pull-right removeCart" ng-hide="yexpires1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Add Expires headers'"+','+amount+","+"'yexpires1'"+')" class="pull-right addCartClass" ng-show="yexpires1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});*/
				}
				else if(yres[key].score>=50 && yres[key].score<75)
				{
					$scope.yexpiresColor="background-color:#5C9BD1;color:white";
					$scope.yexpiresScore=yres[key].score;
					console.log(yres[key].score+"sdasdajkgsdagbsadgjsdag")
					//var myE2 = angular.element(document.querySelector('#yexpiresCart'));
					/*var amount=12;
					pagespeedArray.push({"name":"Add Expires headers","score":yres[key].score,"amount":amount,"shortName":"yexpires1"});
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Add Expires headers'"+','+amount+","+"'yexpires1'"+')"  class="pull-right removeCart" ng-hide="yexpires1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Add Expires headers'"+','+amount+","+"'yexpires1'"+')" class="pull-right addCartClass" ng-show="yexpires1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});*/
				}
				else if(yres[key].score>=75 && yres[key].score<90)
				{
					$scope.yexpiresColor="background-color:#5C9BD1;color:white";
					$scope.yexpiresScore=yres[key].score;
					console.log(yres[key].score+"sdasdajkgsdagbsadgjsdag")
					//var myE2 = angular.element(document.querySelector('#yexpiresCart'));
					
					/*var amount=10;
					pagespeedArray.push({"name":"Add Expires headers","score":yres[key].score,"amount":amount,"shortName":"yexpires1"});
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Add Expires headers'"+','+amount+","+"'yexpires1'"+')"  class="pull-right removeCart" ng-hide="yexpires1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Add Expires headers'"+','+amount+","+"'yexpires1'"+')" class="pull-right addCartClass" ng-show="yexpires1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});*/
				}
				else if(yres[key].score>=90 && yres[key].score<100)
				{
					//var myE2 = angular.element(document.querySelector('#yexpiresCart'));
					$scope.yexpiresColor="background-color:#4DB3A2;color:white";
					$scope.yexpiresScore=yres[key].score;
					console.log(yres[key].score+"sdasdajkgsdagbsadgjsdag")
					/*var amount=5;
					pagespeedArray.push({"name":"Add Expires headers","score":yres[key].score,"amount":amount,"shortName":"yexpires1"});
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Add Expires headers'"+','+amount+","+"'yexpires1'"+')"  class="pull-right removeCart" ng-hide="yexpires1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Add Expires headers'"+','+amount+","+"'yexpires1'"+')" class="pull-right addCartClass" ng-show="yexpires1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					}); */
				}
				else if(yres[key].score==100)
				{
					$scope.yexpiresColor="background-color:#4DB3A2;color:white";
					$scope.yexpiresScore=yres[key].score;
					console.log(yres[key].score+"sdasdajkgsdagbsadgjsdag")
				}
				if(yres[key].components.length!=0)
				{
					$("#yexpiresHeading").append(yslow.g.yexpires.message);
					considerFix_p_c7=document.getElementById("considerFix_p_c7");
					for(var i=0;i<yres[key].components.length;i++)
					{
						if(yres[key].components[i]!=undefined)
						{
							considerFix_p_c7.innerHTML = considerFix_p_c7.innerHTML+"<a href="+yres[key].components[i]+" target='_blank'>"+"<li>"+yres[key].components[i]+"</a>";
						}
					}
				}
				else
				{
					$("#yexpiresHeading").append("<p style='color:black'>You scored 100% on this recommendation - nothing to do here!</p>");
				}
				considerFix_p_c7.innerHTML=considerFix_p_c7.innerHTML+"<br/>";
			}
			if(key == "yexpressions")
			{
				$scope.yexpressions = "Avoid CSS expressions";
				if(yres[key].score>=0 && yres[key].score<50)
				{
					var amount=5;
					pagespeedArray.push({"name":"Avoid CSS expressions","score":yres[key].score,"amount":amount,"shortName":"yexpressions1"});
					var myE2 = angular.element(document.querySelector('#yexpressCart'));
					$scope.yexpressionsColor="background-color:#f36a5a;color:white";
					$scope.yexpressionsScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Avoid CSS expressions'"+','+amount+","+"'yexpressions1'"+')"  class="pull-right removeCart" ng-hide="yexpressions1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Avoid CSS expressions'"+','+amount+","+"'yexpressions1'"+')"  class="pull-right addCartClass" ng-show="yexpressions1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=50 && yres[key].score<75)
				{
					var amount=5;
					pagespeedArray.push({"name":"Avoid CSS expressions","score":yres[key].score,"amount":amount,"shortName":"yexpressions1"});
					var myE2 = angular.element(document.querySelector('#yexpressCart'));
					$scope.yexpressionsColor="background-color:#5C9BD1;color:white";
					$scope.yexpressionsScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Avoid CSS expressions'"+','+amount+","+"'yexpressions1'"+')"  class="pull-right removeCart" ng-hide="yexpressions1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Avoid CSS expressions'"+','+amount+","+"'yexpressions1'"+')"  class="pull-right addCartClass" ng-show="yexpressions1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=75 && yres[key].score<90)
				{
					var amount=5;
					pagespeedArray.push({"name":"Avoid CSS expressions","score":yres[key].score,"amount":amount,"shortName":"yexpressions1"});
					var myE2 = angular.element(document.querySelector('#yexpressCart'));
					$scope.yexpressionsColor="background-color:#5C9BD1;color:white";
					$scope.yexpressionsScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Avoid CSS expressions'"+','+amount+","+"'yexpressions1'"+')"  class="pull-right removeCart" ng-hide="yexpressions1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Avoid CSS expressions'"+','+amount+","+"'yexpressions1'"+')"  class="pull-right addCartClass" ng-show="yexpressions1.show">'+'Add Item</button>';
					myE2.append(result); 
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					}); 
				}
				else if(yres[key].score>=90 && yres[key].score<100)
				{
					var amount=5;
					pagespeedArray.push({"name":"Avoid CSS expressions","score":yres[key].score,"amount":amount,"shortName":"yexpressions1"});
					var myE2 = angular.element(document.querySelector('#yexpressCart'));
					$scope.yexpressionsColor="background-color:#4DB3A2;color:white";
					$scope.yexpressionsScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Avoid CSS expressions'"+','+amount+","+"'yexpressions1'"+')"  class="pull-right removeCart" ng-hide="yexpressions1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Avoid CSS expressions'"+','+amount+","+"'yexpressions1'"+')"  class="pull-right addCartClass" ng-show="yexpressions1.show">'+'Add Item</button>';
					myE2.append(result); 
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score==100)
				{
					$scope.yexpressionsColor="background-color:#4DB3A2;color:white";
					$scope.yexpressionsScore=yres[key].score;
				}
				if(yres[key].components.length!=0)
				{
					$("#yexpressionsHeading").append(yslow.g.yexpressions.message);
					considerFix_p_c8=document.getElementById("considerFix_p_c8");
					for(var i=0;i<yres[key].components.length;i++)
					{
						if(yres[key].components[i]!=undefined)
						{
							considerFix_p_c8.innerHTML = considerFix_p_c8.innerHTML+"<li>"+yres[key].components[i];
						}
					}
				}
				else
				{
					$("#yexpressionsHeading").append("<p style='color:black'>You scored 100% on this recommendation - nothing to do here!</p>");
				}
				considerFix_p_c8.innerHTML=considerFix_p_c8.innerHTML+"<br/>";
			}
			if(key == "yexternal")
			{
				$scope.yexternal = "Make JavaScript and CSS external";
				if(yres[key].score>=0 && yres[key].score<50)
				{
					
					var myE2 = angular.element(document.querySelector('#yexternalCart'));
					$scope.yexternalColor="background-color:#f36a5a;color:white";
					$scope.yexternalScore=yres[key].score;
					myE2.append(result); 
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					}); 
				}
				else if(yres[key].score>=50 && yres[key].score<75)
				{
					var myE2 = angular.element(document.querySelector('#yexternalCart'));
					$scope.yexternalColor="background-color:#5C9BD1;color:white";
					$scope.yexternalScore=yres[key].score;
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=75 && yres[key].score<90)
				{
					var myE2 = angular.element(document.querySelector('#yexternalCart'));
					$scope.yexternalColor="background-color:#5C9BD1;color:white";
					$scope.yexternalScore=yres[key].score;
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					}); 
				}
				else if(yres[key].score>=90 && yres[key].score<100)
				{
					var myE2 = angular.element(document.querySelector('#yexternalCart'));
					$scope.yexternalColor="background-color:#4DB3A2;color:white";
					$scope.yexternalScore=yres[key].score;
					myE2.append(result); 
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score==100)
				{
					$scope.yexternalColor="background-color:#4DB3A2;color:white";
					$scope.yexternalScore=yres[key].score;
				}
				else
				{
					$scope.yexternalColor="background-color:cadetblue;color:white";
					$scope.yexternalScore="(n/a)";
				}
				if(yres[key].components.length!=0)
				{
					$("#yexternalHeading").append(yslow.g.yexternal.message);
					considerFix_p_c9=document.getElementById("considerFix_p_c9");
					for(var i=0;i<yres[key].components.length;i++)
					{
						if(yres[key].components[i]!=undefined)
						{
							considerFix_p_c9.innerHTML = considerFix_p_c9.innerHTML+"<li>"+yres[key].components[i];
						}
					}
				}
				else
				{
					$("#yexternalHeading").append("<p style='color:black'>You scored 100% on this recommendation - nothing to do here!</p>");
				}
				considerFix_p_c9.innerHTML=considerFix_p_c9.innerHTML+"<br/>";
			}
			if(key == "yfavicon")
			{
				$scope.yfavicon = "Make favicon small and cacheable";
				if(yres[key].score>=0 && yres[key].score<50)
				{
					var amount=5;
					pagespeedArray.push({"name":"Make favicon small and cacheable","score":yres[key].score,"amount":amount,"shortName":"yfavicon1"});
					var myE2 = angular.element(document.querySelector('#yfaviconCart'));
					$scope.yfaviconColor="background-color:#f36a5a;color:white";
					$scope.yfaviconScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Make favicon small and cacheable'"+','+amount+","+"'yfavicon1'"+')"  class="pull-right removeCart" ng-hide="yfavicon1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Make favicon small and cacheable'"+','+amount+","+"'yfavicon1'"+')"  class="pull-right addCartClass" ng-show="yfavicon1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					}); 
				}
				else if(yres[key].score>=50 && yres[key].score<75)
				{
					var amount=5;
					pagespeedArray.push({"name":"Make favicon small and cacheable","score":yres[key].score,"amount":amount,"shortName":"yfavicon1"});
					var myE2 = angular.element(document.querySelector('#yfaviconCart'));
					$scope.yfaviconColor="background-color:#5C9BD1;color:white";
					$scope.yfaviconScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Make favicon small and cacheable'"+','+amount+","+"'yfavicon1'"+')"  class="pull-right removeCart" ng-hide="yfavicon1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Make favicon small and cacheable'"+','+amount+","+"'yfavicon1'"+')"  class="pull-right addCartClass" ng-show="yfavicon1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=75 && yres[key].score<90)
				{
					var amount=5;
					pagespeedArray.push({"name":"Make favicon small and cacheable","score":yres[key].score,"amount":amount,"shortName":"yfavicon1"});
					var myE2 = angular.element(document.querySelector('#yfaviconCart'));
					$scope.yfaviconColor="background-color:#5C9BD1;color:white";
					$scope.yfaviconScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Make favicon small and cacheable'"+','+amount+","+"'yfavicon1'"+')"  class="pull-right removeCart" ng-hide="yfavicon1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Make favicon small and cacheable'"+','+amount+","+"'yfavicon1'"+')"  class="pull-right addCartClass" ng-show="yfavicon1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=90 && yres[key].score<100)
				{
					var amount=5;
					pagespeedArray.push({"name":"Make favicon small and cacheable","score":yres[key].score,"amount":amount,"shortName":"yfavicon1"});
					var myE2 = angular.element(document.querySelector('#yfaviconCart'));
					$scope.yfaviconColor="background-color:#4DB3A2;color:white";
					$scope.yfaviconScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Make favicon small and cacheable'"+','+amount+","+"'yfavicon1'"+')"  class="pull-right removeCart" ng-hide="yfavicon1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Make favicon small and cacheable'"+','+amount+","+"'yfavicon1'"+')"  class="pull-right addCartClass" ng-show="yfavicon1.show">'+'Add Item</button>';
					myE2.append(result); 
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score==100)
				{
					$scope.yfaviconColor="background-color:#4DB3A2;color:white";
					$scope.yfaviconScore=yres[key].score;
				}
				if(yres[key].components.length!=0)
				{
					$("#yfaviconHeading").append(yslow.g.yfavicon.message);
					considerFix_p_c10=document.getElementById("considerFix_p_c10");
					for(var i=0;i<yres[key].components.length;i++)
					{
						if(yres[key].components[i]!=undefined)
						{
							considerFix_p_c10.innerHTML = considerFix_p_c10.innerHTML+"<li>"+yres[key].components[i];
						}
					}
				}
				else
				{
					$("#yfaviconHeading").append("<p style='color:black'>You scored 100% on this recommendation - nothing to do here!</p>");
				}
				considerFix_p_c10.innerHTML=considerFix_p_c10.innerHTML+"<br/>";
			}
			if(key == "ymincookie")
			{
				$scope.ymincookie = "Reduce cookie size";
				if(yres[key].score>=0 && yres[key].score<50)
				{
					var amount=5;
					pagespeedArray.push({"name":"Reduce cookie size","score":yres[key].score,"amount":amount,"shortName":"ymincookie1"});
					var myE2 = angular.element(document.querySelector('#ymincookieCart'));
					$scope.ymincookieColor="background-color:#f36a5a;color:white";
					$scope.ymincookieScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Reduce cookie size'"+','+amount+","+"'ymincookie1'"+')"  class="pull-right removeCart" ng-hide="ymincookie1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Reduce cookie size'"+','+amount+","+"'ymincookie1'"+')"  class="pull-right addCartClass" ng-show="ymincookie1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=50 && yres[key].score<75)
				{
					var amount=5;
					pagespeedArray.push({"name":"Reduce cookie size","score":yres[key].score,"amount":amount,"shortName":"ymincookie1"});
					var myE2 = angular.element(document.querySelector('#ymincookieCart'));
					$scope.ymincookieColor="background-color:#5C9BD1;color:white";
					$scope.ymincookieScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Reduce cookie size'"+','+amount+","+"'ymincookie1'"+')"  class="pull-right removeCart" ng-hide="ymincookie1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Reduce cookie size'"+','+amount+","+"'ymincookie1'"+')"  class="pull-right addCartClass" ng-show="ymincookie1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=75 && yres[key].score<90)
				{
					var amount=5;
					pagespeedArray.push({"name":"Reduce cookie size","score":yres[key].score,"amount":amount,"shortName":"ymincookie1"});
					var myE2 = angular.element(document.querySelector('#ymincookieCart'));
					$scope.ymincookieColor="background-color:#5C9BD1;color:white";
					$scope.ymincookieScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Reduce cookie size'"+','+amount+","+"'ymincookie1'"+')"  class="pull-right removeCart" ng-hide="ymincookie1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Reduce cookie size'"+','+amount+","+"'ymincookie1'"+')"  class="pull-right addCartClass" ng-show="ymincookie1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=90 && yres[key].score<100)
				{
					var amount=5;
					pagespeedArray.push({"name":"Reduce cookie size","score":yres[key].score,"amount":amount,"shortName":"ymincookie1"});
					var myE2 = angular.element(document.querySelector('#ymincookieCart'));$scope.ymincookieColor="background-color:#4DB3A2;color:white";
					$scope.ymincookieScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Reduce cookie size'"+','+amount+","+"'ymincookie1'"+')"  class="pull-right removeCart" ng-hide="ymincookie1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Reduce cookie size'"+','+amount+","+"'ymincookie1'"+')"  class="pull-right addCartClass" ng-show="ymincookie1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score==100)
				{
					$scope.ymincookieColor="background-color:#4DB3A2;color:white";
					$scope.ymincookieScore=yres[key].score;
				}
				if(yres[key].components.length!=0)
				{
					$("#ymincookieHeading").append(yslow.g.ymincookie.message);considerFix_p_c11=document.getElementById("considerFix_p_c11");
					for(var i=0;i<yres[key].components.length;i++)
					{
						if(yres[key].components[i]!=undefined)
						{
							considerFix_p_c11.innerHTML = considerFix_p_c11.innerHTML+"<li>"+yres[key].components[i];
						}
					}
				}
				else
				{
					$("#ymincookieHeading").append("<p style='color:black'>You scored 100% on this recommendation - nothing to do here!</p>");
				}
				considerFix_p_c11.innerHTML=considerFix_p_c11.innerHTML+"<br/>";
			}
			if(key == "ymindom")
			{
				$scope.ymindom = "Reduce the number of DOM elements";
				if(yres[key].score==0 && yres[key].score<50)
				{
					var amount=5;
					pagespeedArray.push({"name":"Reduce the number of DOM elements","score":yres[key].score,"amount":amount,"shortName":"ymindom1"});
					var myE2 = angular.element(document.querySelector('#ymindomCart'));
					$scope.ymindomColor="background-color:#f36a5a;color:white";
					$scope.ymindomScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Reduce the number of DOM elements'"+','+amount+","+"'ymindom1'"+')"  class="pull-right removeCart" ng-hide="ymindom1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Reduce the number of DOM elements'"+','+amount+","+"'ymindom1'"+')" class="pull-right addCartClass" ng-show="ymindom1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=50 && yres[key].score<75)
				{
					var amount=5;
					pagespeedArray.push({"name":"Reduce the number of DOM elements","score":yres[key].score,"amount":amount,"shortName":"ymindom1"});
					var myE2 = angular.element(document.querySelector('#ymindomCart'));
					$scope.ymindomColor="background-color:#5C9BD1;color:white";
					$scope.ymindomScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Reduce the number of DOM elements'"+','+amount+","+"'ymindom1'"+')"  class="pull-right removeCart" ng-hide="ymindom1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Reduce the number of DOM elements'"+','+amount+","+"'ymindom1'"+')" class="pull-right addCartClass" ng-show="ymindom1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=75 && yres[key].score<90)
				{
					var amount=5;
					pagespeedArray.push({"name":"Reduce the number of DOM elements","score":yres[key].score,"amount":amount,"shortName":"ymindom1"});
					var myE2 = angular.element(document.querySelector('#ymindomCart'));
					$scope.ymindomColor="background-color:#5C9BD1;color:white";
					$scope.ymindomScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Reduce the number of DOM elements'"+','+amount+","+"'ymindom1'"+')"  class="pull-right removeCart" ng-hide="ymindom1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Reduce the number of DOM elements'"+','+amount+","+"'ymindom1'"+')" class="pull-right addCartClass" ng-show="ymindom1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=90 && yres[key].score<100)
				{
					var amount=5;
					pagespeedArray.push({"name":"Reduce the number of DOM elements","score":yres[key].score,"amount":amount,"shortName":"ymindom1"});
					var myE2 = angular.element(document.querySelector('#ymindomCart'));
					$scope.ymindomColor="background-color:#4DB3A2;color:white";
					$scope.ymindomScore=yres[key].score;
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Reduce the number of DOM elements'"+','+amount+","+"'ymindom1'"+')"  class="pull-right removeCart" ng-hide="ymindom1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Reduce the number of DOM elements'"+','+amount+","+"'ymindom1'"+')"  class="pull-right addCartClass" ng-show="ymindom1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score==100)
				{
					$scope.ymindomColor="background-color:#4DB3A2;color:white";
					$scope.ymindomScore=yres[key].score;
				}
				if(yres[key].components.length!=0)
				{
					$("#ymindomHeading").append(yslow.g.ymindom.message);
					considerFix_p_c12=document.getElementById("considerFix_p_c12");
					for(var i=0;i<yres[key].components.length;i++)
					{
						if(yres[key].components[i]!=undefined)
						{
							considerFix_p_c12.innerHTML = considerFix_p_c12.innerHTML+"<li>"+yres[key].components[i];
						}
					}
				}
				else if(yslow.g.ymindom.message!="")
				{
					$("#ymindomHeading").append(yslow.g.ymindom.message);
				}
				else
				{
					$("#ymindomHeading").append("<p style='color:black'>You scored 100% on this recommendation - nothing to do here!</p>");
				}
				considerFix_p_c12.innerHTML=considerFix_p_c12.innerHTML+"<br/>";
			}
			if(key == "yminify")
			{
				$scope.yminify = "Minify JavaScript and CSS";
				if(yres[key].score>0 && yres[key].score<50)
				{
					var myE2 = angular.element(document.querySelector('#yminifyCart'));
					$scope.yminifyColor="background-color:#f36a5a;color:white";
					$scope.yminifyScore=yres[key].score;
					/*var amount=15;
					pagespeedArray.push({"name":"Minify JavaScript and CSS","score":yres[key].score,"amount":amount,"shortName":"yminify1"});
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Minify JavaScript and CSS'"+','+amount+","+"'yminify1'"+')"  class="pull-right removeCart" ng-hide="yminify1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Minify JavaScript and CSS'"+','+amount+","+"'yminify1'"+')"  class="pull-right addCartClass" ng-show="yminify1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});*/
				}
				else if(yres[key].score>=50 && yres[key].score<75)
				{
					var myE2 = angular.element(document.querySelector('#yminifyCart'));
					$scope.yminifyColor="background-color:#5C9BD1;color:white";
					$scope.yminifyScore=yres[key].score;
					/*var amount=12;
					pagespeedArray.push({"name":"Minify JavaScript and CSS","score":yres[key].score,"amount":amount,"shortName":"yminify1"});
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Minify JavaScript and CSS'"+','+amount+","+"'yminify1'"+')"  class="pull-right removeCart" ng-hide="yminify1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Minify JavaScript and CSS'"+','+amount+","+"'yminify1'"+')"  class="pull-right addCartClass" ng-show="yminify1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});*/
				}
				else if(yres[key].score>=75 && yres[key].score<90)
				{
					var myE2 = angular.element(document.querySelector('#yminifyCart'));
					$scope.yminifyColor="background-color:#5C9BD1;color:white";
					$scope.yminifyScore=yres[key].score;
					/*var amount=10;
					pagespeedArray.push({"name":"Minify JavaScript and CSS","score":yres[key].score,"amount":amount,"shortName":"yminify1"});
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Minify JavaScript and CSS'"+','+amount+","+"'yminify1'"+')"  class="pull-right removeCart" ng-hide="yminify1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Minify JavaScript and CSS'"+','+amount+","+"'yminify1'"+')"  class="pull-right addCartClass" ng-show="yminify1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});*/
				}
				else if(yres[key].score>=90 && yres[key].score<100)
				{
					var myE2 = angular.element(document.querySelector('#yminifyCart'));
					$scope.yminifyColor="background-color:#4DB3A2;color:white";
					$scope.yminifyScore=yres[key].score;
					/*var amount=5;
					pagespeedArray.push({"name":"Minify JavaScript and CSS","score":yres[key].score,"amount":amount,"shortName":"yminify1"});
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Minify JavaScript and CSS'"+','+amount+","+"'yminify1'"+')"  class="pull-right removeCart" ng-hide="yminify1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Minify JavaScript and CSS'"+','+amount+","+"'yminify1'"+')"  class="pull-right addCartClass" ng-show="yminify1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});*/
				}
				else if(yres[key].score==100)
				{
					$scope.yminifyColor="background-color:#4DB3A2;color:white";
					$scope.yminifyScore=yres[key].score;
				}
				if(yres[key].components.length!=0)
				{
					$("#yminifyHeading").append(yslow.g.yminify.message);
					considerFix_p_c13=document.getElementById("considerFix_p_c13");
					for(var i=0;i<yres[key].components.length;i++)
					{
						if(yres[key].components[i]!=undefined)
						{
							if(yres[key].components[i].startsWith("inline")==true)
							{
								considerFix_p_c13.innerHTML = considerFix_p_c13.innerHTML+"<li class='myScript'>"+"<script>"+yres[key].components[i];
							}
							else{
								considerFix_p_c13.innerHTML = considerFix_p_c13.innerHTML+"<li class='myScript'>"+"<a href='"+yres[key].components[i]+"' target='_blank'>"+"<script>"+yres[key].components[i];
							}
							
						}
					}
				}
				else
				{
					$("#yminifyHeading").append("<p style='color:black'>You scored 100% on this recommendation - nothing to do here!</p>");
				}
				considerFix_p_c13.innerHTML=considerFix_p_c13.innerHTML+"<br/>";
			}
			if(key == "ynumreq")
			{
				$scope.ynumreq = "Make fewer HTTP requests";
				var amount;
				if(yres[key].score>=0 && yres[key].score<50)
				{
					amount=5;
					pagespeedArray.push({"name":"Make fewer HTTP requests","score":yres[key].score,"amount":amount,"shortName":"ynumreq1"});
					$scope.ynumreqColor="background-color:#f36a5a;color:white";
					$scope.ynumreqScore=yres[key].score;
					var myE2 = angular.element(document.querySelector('#ynumreqCart'));
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Make fewer HTTP requests'"+','+amount+","+"'ynumreq1'"+')"  class="pull-right removeCart" ng-hide="ynumreq1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Make fewer HTTP requests'"+','+amount+","+"'ynumreq1'"+')"  class="pull-right addCartClass" ng-show="ynumreq1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=50 && yres[key].score<75)
				{
					amount=5;
					pagespeedArray.push({"name":"Make fewer HTTP requests","score":yres[key].score,"amount":amount,"shortName":"ynumreq1"});
					$scope.ynumreqColor="background-color:#5C9BD1;color:white";
					$scope.ynumreqScore=yres[key].score;
					var myE2 = angular.element(document.querySelector('#ynumreqCart'));
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Make fewer HTTP requests'"+','+amount+","+"'ynumreq1'"+')"  class="pull-right removeCart" ng-hide="ynumreq1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Make fewer HTTP requests'"+','+amount+","+"'ynumreq1'"+')"  class="pull-right addCartClass" ng-show="ynumreq1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=75 && yres[key].score<90)
				{
					amount=5;
					pagespeedArray.push({"name":"Make fewer HTTP requests","score":yres[key].score,"amount":amount,"shortName":"ynumreq1"});
					$scope.ynumreqColor="background-color:#5C9BD1;color:white";
					$scope.ynumreqScore=yres[key].score;
					var myE2 = angular.element(document.querySelector('#ynumreqCart'));
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Make fewer HTTP requests'"+','+amount+","+"'ynumreq1'"+')"  class="pull-right removeCart" ng-hide="ynumreq1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Make fewer HTTP requests'"+','+amount+","+"'ynumreq1'"+')"  class="pull-right addCartClass" ng-show="ynumreq1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=90 && yres[key].score<100)
				{
					amount=5;
					pagespeedArray.push({"name":"Make fewer HTTP requests","score":yres[key].score,"amount":amount,"shortName":"ynumreq1"});
					$scope.ynumreqColor="background-color:#4DB3A2;color:white";
					$scope.ynumreqScore=yres[key].score;
					var myE2 = angular.element(document.querySelector('#ynumreqCart'));
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Make fewer HTTP requests'"+','+amount+","+"'ynumreq1'"+')"  class="pull-right removeCart" ng-hide="ynumreq1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Make fewer HTTP requests'"+','+amount+","+"'ynumreq1'"+')"  class="pull-right addCartClass" ng-show="ynumreq1.show">'+'Add Item</button>';
					myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score==100)
				{
					$scope.ynumreqColor="background-color:#4DB3A2;color:white";
					$scope.ynumreqScore=yres[key].score;
				}
				if(yres[key].components.length!=0)
				{
					$("#ynumreqHeading").append(yslow.g.ynumreq.message);
					considerFix_p_c14=document.getElementById("considerFix_p_c14");
					for(var i=0;i<yres[key].components.length;i++)
					{
						if(yres[key].components[i]!=undefined)
						{
							considerFix_p_c14.innerHTML = considerFix_p_c14.innerHTML+"<li>"+yres[key].components[i]+"<br>";
						}
					}
				}
				else if(yres[key].components.length==0 && yslow.g.ynumreq.message!="")
				{
					var myarray = yslow.g.ynumreq.message.split('.');
					for(var i = 0; i < myarray.length; i=i+2)
					{
						if(myarray[i+1]!=undefined)
						{
							$("#ynumreqHeading").append(myarray[i]+"."+myarray[i+1]+".<br/>");
						}
					}
				}
				else
				{
					$("#ynumreqHeading").append("<p style='color:black'>You scored 100% on this recommendation - nothing to do here!</p>");
				}
				considerFix_p_c14.innerHTML=considerFix_p_c14.innerHTML+"<br/>";
			}
			if(key == "yxhrmethod")
			{
				$scope.yxhrmethod = "Use GET for AJAX requests";
				var amount;
				if(yres[key].score>=0 && yres[key].score<50)
				{
					amount=5;
					pagespeedArray.push({"name":"Use GET for AJAX requests","score":yres[key].score,"amount":amount,"shortName":"yxhrmethod1"});
					$scope.yxhrmethodColor="background-color:#f36a5a;color:white";
					$scope.yxhrmethodScore=yres[key].score;
					var myE2 = angular.element(document.querySelector('#yxhrmethodCart'));
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Use GET for AJAX requests'"+','+amount+","+"'yxhrmethod1'"+')"  class="pull-right removeCart" ng-hide="yxhrmethod1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Use GET for AJAX requests'"+','+amount+","+"'yxhrmethod1'"+')"  class="pull-right addCartClass" ng-show="yxhrmethod1.show">'+'Add Item</button>';myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=50 && yres[key].score<75)
				{
					amount=5;
					pagespeedArray.push({"name":"Use GET for AJAX requests","score":yres[key].score,"amount":amount,"shortName":"yxhrmethod1"});
					$scope.yxhrmethodColor="background-color:#5C9BD1;color:white";
					$scope.yxhrmethodScore=yres[key].score;
					var myE2 = angular.element(document.querySelector('#yxhrmethodCart'));
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Use GET for AJAX requests'"+','+amount+","+"'yxhrmethod1'"+')"  class="pull-right removeCart" ng-hide="yxhrmethod1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Use GET for AJAX requests'"+','+amount+","+"'yxhrmethod1'"+')"  class="pull-right addCartClass" ng-show="yxhrmethod1.show">'+'Add Item</button>';myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=75 && yres[key].score<90)
				{
					amount=5;
					pagespeedArray.push({"name":"Use GET for AJAX requests","score":yres[key].score,"amount":amount,"shortName":"yxhrmethod1"});
					$scope.yxhrmethodColor="background-color:#5C9BD1;color:white";
					$scope.yxhrmethodScore=yres[key].score;
					var myE2 = angular.element(document.querySelector('#yxhrmethodCart'));
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Use GET for AJAX requests'"+','+amount+","+"'yxhrmethod1'"+')"  class="pull-right removeCart" ng-hide="yxhrmethod1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Use GET for AJAX requests'"+','+amount+","+"'yxhrmethod1'"+')"  class="pull-right addCartClass" ng-show="yxhrmethod1.show">'+'Add Item</button>';myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=90 && yres[key].score<100)
				{
					amount=5;
					pagespeedArray.push({"name":"Use GET for AJAX requests","score":yres[key].score,"amount":amount,"shortName":"yxhrmethod1"});
					$scope.yxhrmethodColor="background-color:#4DB3A2;color:white";
					$scope.yxhrmethodScore=yres[key].score;
					var myE2 = angular.element(document.querySelector('#yxhrmethodCart'));
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Use GET for AJAX requests'"+','+amount+","+"'yxhrmethod1'"+')"  class="pull-right removeCart" ng-hide="yxhrmethod1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Use GET for AJAX requests'"+','+amount+","+"'yxhrmethod1'"+')"  class="pull-right addCartClass" ng-show="yxhrmethod1.show">'+'Add Item</button>';myE2.append(result);
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score==100)
				{
					$scope.yxhrmethodColor="background-color:#4DB3A2;color:white";
					$scope.yxhrmethodScore=yres[key].score;
				}
				if(yres[key].components.length!=0)
				{
					$("#yxhrmethodHeading").append(yslow.g.yxhrmethod.message);
					considerFix_p_c15=document.getElementById("considerFix_p_c15");
					for(var i=0;i<yres[key].components.length;i++)
					{
						if(yres[key].components[i]!=undefined)
						{
							considerFix_p_c15.innerHTML = considerFix_p_c15.innerHTML+"<li>"+yres[key].components[i];
						}
					}
				}
				else
				{
					$("#yxhrmethodHeading").append("<p style='color:black'>You scored 100% on this recommendation - nothing to do here!</p>");
				}
				considerFix_p_c15.innerHTML=considerFix_p_c15.innerHTML+"<br/>";
			}
			if(key == "yxhr")
			{
				$scope.yxhr = "Make AJAX cacheable";
				var amount;
				if(yres[key].score>=0 && yres[key].score<50)
				{
					amount=5;
					pagespeedArray.push({"name":"Make AJAX cacheable","score":yres[key].score,"amount":amount,"shortName":"yxhr1"});
					$scope.yxhrColor="background-color:#f36a5a;color:white";
					$scope.yxhrScore=yres[key].score;
					var myE2 = angular.element(document.querySelector('#yxhrCart'));
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Make AJAX cacheable'"+','+amount+","+"'yxhr1'"+')"  class="pull-right removeCart" ng-hide="yxhr1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Make AJAX cacheable'"+','+amount+","+"'yxhr1'"+')"  class="pull-right addCartClass" ng-show="yxhr1.show">'+'Add Item</button>';
					myE2.append(result); 
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=50 && yres[key].score<75)
				{
					amount=5;
					pagespeedArray.push({"name":"Make AJAX cacheable","score":yres[key].score,"amount":amount,"shortName":"yxhr1"});
					$scope.yxhrColor="background-color:#5C9BD1;color:white";
					$scope.yxhrScore=yres[key].score;
					var myE2 = angular.element(document.querySelector('#yxhrCart'));
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Make AJAX cacheable'"+','+amount+","+"'yxhr1'"+')"  class="pull-right removeCart" ng-hide="yxhr1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Make AJAX cacheable'"+','+amount+","+"'yxhr1'"+')"  class="pull-right addCartClass" ng-show="yxhr1.show">'+'Add Item</button>';
					myE2.append(result); 
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=75 && yres[key].score<90)
				{
					amount=5;
					pagespeedArray.push({"name":"Make AJAX cacheable","score":yres[key].score,"amount":amount,"shortName":"yxhr1"});
					$scope.yxhrColor="background-color:#5C9BD1;color:white";
					$scope.yxhrScore=yres[key].score;
					var myE2 = angular.element(document.querySelector('#yxhrCart'));
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Make AJAX cacheable'"+','+amount+","+"'yxhr1'"+')"  class="pull-right removeCart" ng-hide="yxhr1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Make AJAX cacheable'"+','+amount+","+"'yxhr1'"+')"  class="pull-right addCartClass" ng-show="yxhr1.show">'+'Add Item</button>';
					myE2.append(result); 
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score>=90 && yres[key].score<100)
				{
					amount=5;
					pagespeedArray.push({"name":"Make AJAX cacheable","score":yres[key].score,"amount":amount,"shortName":"yxhr1"});
					$scope.yxhrColor="background-color:#4DB3A2;color:white";
					$scope.yxhrScore=yres[key].score;
					var myE2 = angular.element(document.querySelector('#yxhrCart'));
					var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Make AJAX cacheable'"+','+amount+","+"'yxhr1'"+')"  class="pull-right removeCart" ng-hide="yxhr1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Make AJAX cacheable'"+','+amount+","+"'yxhr1'"+')"  class="pull-right addCartClass" ng-show="yxhr1.show">'+'Add Item</button>';
					myE2.append(result); 
					angular.element(myE2).injector().invoke(function($compile){
						var scope=angular.element(myE2).scope();
						$compile(myE2.contents())(scope);
					});
				}
				else if(yres[key].score==100)
				{
					$scope.yxhrColor="background-color:#4DB3A2;color:white";
					$scope.yxhrScore=yres[key].score;
				}
				if(yres[key].components.length!=0)
				{
					$("#yxhrHeading").append(yslow.g.yxhr.message);
					considerFix_p_c16=document.getElementById("considerFix_p_c16");
					for(var i=0;i<yres[key].components.length;i++)
					{
						if(yres[key].components[i]!=undefined)
						{
							considerFix_p_c16.innerHTML = considerFix_p_c16.innerHTML+"<li>"+yres[key].components[i];
						}
					}
				}
			else
			{
				$("#yxhrHeading").append("<p style='color:black'>You scored 100% on this recommendation - nothing to do here!</p>");
			}
			considerFix_p_c16.innerHTML=considerFix_p_c16.innerHTML;
		}
		if(key == "yno404")
		{
			$scope.yno404 = "Avoid HTTP 404 (Not Found) error";
			var amount;
			if(yres[key].score>=0 && yres[key].score<50)
			{
				$scope.yno404Color="background-color:#f36a5a;color:white";
				$scope.yno404Score=yres[key].score;
				var myE2 = angular.element(document.querySelector('#yno404Cart'));
				/*amount=15;
				pagespeedArray.push({"name":"Avoid HTTP 404 (Not Found) error","score":yres[key].score,"amount":amount,"shortName":"yno4041"});
				var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Avoid HTTP 404 (Not Found) error'"+','+amount+","+"'yno4041'"+')"  class="pull-right removeCart" ng-hide="yno4041.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Avoid HTTP 404 (Not Found) error'"+','+amount+","+"'yno4041'"+')" class="pull-right addCartClass" ng-show="yno4041.show">'+'Add Item</button>';
				myE2.append(result);
				angular.element(myE2).injector().invoke(function($compile){
					var scope=angular.element(myE2).scope();
					$compile(myE2.contents())(scope);
				});*/
			}
			else if(yres[key].score>=50 && yres[key].score<75)
			{
				$scope.yno404Color="background-color:#5C9BD1;color:white";
				$scope.yno404Score=yres[key].score;
				var myE2 = angular.element(document.querySelector('#yno404Cart'));
				/*amount=12;
				pagespeedArray.push({"name":"Avoid HTTP 404 (Not Found) error","score":yres[key].score,"amount":amount,"shortName":"yno4041"});
				var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Avoid HTTP 404 (Not Found) error'"+','+amount+","+"'yno4041'"+')"  class="pull-right removeCart" ng-hide="yno4041.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Avoid HTTP 404 (Not Found) error'"+','+amount+","+"'yno4041'"+')" class="pull-right addCartClass" ng-show="yno4041.show">'+'Add Item</button>';
				myE2.append(result);
				angular.element(myE2).injector().invoke(function($compile){
					var scope=angular.element(myE2).scope();
					$compile(myE2.contents())(scope);
				});*/
			}
			else if(yres[key].score>=75&& yres[key].score<90)
			{
				$scope.yno404Color="background-color:#5C9BD1;color:white";
				$scope.yno404Score=yres[key].score;
				var myE2 = angular.element(document.querySelector('#yno404Cart'));
				/*amount=10;
				pagespeedArray.push({"name":"Avoid HTTP 404 (Not Found) error","score":yres[key].score,"amount":amount,"shortName":"yno4041"});
				var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Avoid HTTP 404 (Not Found) error'"+','+amount+","+"'yno4041'"+')"  class="pull-right removeCart" ng-hide="yno4041.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Avoid HTTP 404 (Not Found) error'"+','+amount+","+"'yno4041'"+')"  class="pull-right addCartClass" ng-show="yno4041.show">'+'Add Item</button>';
				myE2.append(result);
				angular.element(myE2).injector().invoke(function($compile){
					var scope=angular.element(myE2).scope();
					$compile(myE2.contents())(scope);
				});*/
			}
			else if(yres[key].score>=90&& yres[key].score<100)
			{
				
				
				$scope.yno404Color="background-color:#4DB3A2;color:white";
				$scope.yno404Score=yres[key].score;
				var myE2 = angular.element(document.querySelector('#yno404Cart'));
				/*amount=5;
				pagespeedArray.push({"name":"Avoid HTTP 404 (Not Found) error","score":yres[key].score,"amount":amount,"shortName":"yno4041"});
				var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Avoid HTTP 404 (Not Found) error'"+','+amount+","+"'yno4041'"+')"  class="pull-right removeCart" ng-hide="yno4041.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Avoid HTTP 404 (Not Found) error'"+','+amount+","+"'yno4041'"+')"  class="pull-right addCartClass" ng-show="yno4041.show">'+'Add Item</button>';
				myE2.append(result);
				angular.element(myE2).injector().invoke(function($compile){
					var scope=angular.element(myE2).scope();
					$compile(myE2.contents())(scope);
				});*/
			}
			else if(yres[key].score==100)
			{
				$scope.yno404Color="background-color:#4DB3A2;color:white";
				$scope.yno404Score=yres[key].score;
			}
			if(yres[key].components.length!=0)
			{
				$("#yno404Heading").append(yslow.g.yno404.message);
				considerFix_p_c17=document.getElementById("considerFix_p_c17");
				for(var i=0;i<yres[key].components.length;i++)
				{
					if(yres[key].components[i]!=undefined)
					{
						considerFix_p_c17.innerHTML = considerFix_p_c17.innerHTML+"<a href="+yres[key].components[i]+" target='_blank'>"+"<li>"+yres[key].components[i]+"</a>";
					}
				}
			}
			else
			{
				$("#yno404Heading").append("<p style='color:black'>You scored 100% on this recommendation - nothing to do here!</p>");
			}
			considerFix_p_c17.innerHTML=considerFix_p_c17.innerHTML;
		}
		if(key == "ynofilter")
		{
			$scope.ynofilter = "Avoid AlphaImageLoader filter";
			var amount;
			if(yres[key].score>=0 && yres[key].score<50)
			{
				amount=5;
				pagespeedArray.push({"name":"Avoid AlphaImageLoader filter","score":yres[key].score,"amount":amount,"shortName":"yredirects1"});
				$scope.ynofilterColor="background-color:#f36a5a;color:white";
				$scope.ynofilterScore=yres[key].score;
				var myE2 = angular.element(document.querySelector('#ynofilterCart'));
				var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Avoid AlphaImageLoader filter'"+','+amount+","+"'ynofilter1'"+')"  class="pull-right removeCart" ng-hide="ynofilter1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Avoid AlphaImageLoader filter'"+','+amount+","+"'ynofilter1'"+')"  class="pull-right addCartClass" ng-show="ynofilter1.show">'+'Add Item</button>';
				myE2.append(result); 
				angular.element(myE2).injector().invoke(function($compile){
					var scope=angular.element(myE2).scope();
					$compile(myE2.contents())(scope);
				});
				
			}
			if(yres[key].score>=50 && yres[key].score<75)
			{
				amount=5;
				pagespeedArray.push({"name":"Avoid AlphaImageLoader filter","score":yres[key].score,"amount":amount,"shortName":"yredirects1"});
				$scope.ynofilterColor="background-color:#5C9BD1;color:white";
				$scope.ynofilterScore=yres[key].score;
				var myE2 = angular.element(document.querySelector('#ynofilterCart'));
				var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Avoid AlphaImageLoader filter'"+','+amount+","+"'ynofilter1'"+')"  class="pull-right removeCart" ng-hide="ynofilter1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Avoid AlphaImageLoader filter'"+','+amount+","+"'ynofilter1'"+')"  class="pull-right addCartClass" ng-show="ynofilter1.show">'+'Add Item</button>';
				myE2.append(result); 
				angular.element(myE2).injector().invoke(function($compile){
					var scope=angular.element(myE2).scope();
					$compile(myE2.contents())(scope);
				});
			}
			else if(yres[key].score>=75 && yres[key].score<90)
			{
				amount=5;
				pagespeedArray.push({"name":"Avoid AlphaImageLoader filter","score":yres[key].score,"amount":amount,"shortName":"yredirects1"});
				$scope.ynofilterColor="background-color:#5C9BD1;color:white";
				var myE2 = angular.element(document.querySelector('#ynofilterCart'));
				var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Avoid AlphaImageLoader filter'"+','+amount+","+"'ynofilter1'"+')"  class="pull-right removeCart" ng-hide="ynofilter1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Avoid AlphaImageLoader filter'"+','+amount+","+"'ynofilter1'"+')"  class="pull-right addCartClass" ng-show="ynofilter1.show">'+'Add Item</button>';
				myE2.append(result); 
				angular.element(myE2).injector().invoke(function($compile){
					var scope=angular.element(myE2).scope();
					$compile(myE2.contents())(scope);
				});
				$scope.ynofilterScore=yres[key].score;
			}
			if(yres[key].score>=90 && yres[key].score<100)
			{
				amount=5;
				pagespeedArray.push({"name":"Avoid AlphaImageLoader filter","score":yres[key].score,"amount":amount,"shortName":"yredirects1"});
				$scope.ynofilterColor="background-color:#4DB3A2;color:white";
				$scope.ynofilterScore=yres[key].score;
				var myE2 = angular.element(document.querySelector('#ynofilterCart'));
				var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Avoid AlphaImageLoader filter'"+','+amount+","+"'ynofilter1'"+')"  class="pull-right removeCart" ng-hide="ynofilter1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Avoid AlphaImageLoader filter'"+','+amount+","+"'ynofilter1'"+')"  class="pull-right addCartClass" ng-show="ynofilter1.show">'+'Add Item</button>';
				myE2.append(result); 
				angular.element(myE2).injector().invoke(function($compile){
					var scope=angular.element(myE2).scope();
					$compile(myE2.contents())(scope);
				});
			}
			else if(yres[key].score==100)
			{
				$scope.ynofilterColor="background-color:#4DB3A2;color:white";
				$scope.ynofilterScore=yres[key].score;
			}
			if(yres[key].components.length!=0)
			{
				$("#ynofilterHeading").append(yslow.g.ynofilter.message);
				considerFix_p_c18=document.getElementById("considerFix_p_c18");
				for(var i=0;i<yres[key].components.length;i++)
				{
					if(yres[key].components[i]!=undefined)
					{
						considerFix_p_c18.innerHTML = considerFix_p_c18.innerHTML+"<li>"+yres[key].components[i];
					}
				}
			}
			else
			{
				$("#ynofilterHeading").append("<p style='color:black'>You scored 100% on this recommendation - nothing to do here!</p>")
			}
			considerFix_p_c18.innerHTML=considerFix_p_c18.innerHTML;
		}
		if(key == "yredirects")
		{
			$scope.yredirects = "Avoid URL redirects";
			var amount;
			if(yres[key].score>=0 && yres[key].score<50)
			{
				amount=5;
				pagespeedArray.push({"name":"Avoid URL redirects","score":yres[key].score,"amount":amount,"shortName":"yredirects1"});
				$scope.yredirectsColor="background-color:#f36a5a;color:white";
				$scope.yredirectsScore=yres[key].score;
				var myE2 = angular.element(document.querySelector('#yredirectsCart'));
				var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Avoid URL redirects'"+','+amount+","+"'yredirects1'"+')"  class="pull-right removeCart" ng-hide="yredirects1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Avoid URL redirects'"+','+amount+","+"'yredirects1'"+')"  class="pull-right addCartClass" ng-show="yredirects1.show">'+'Add Item</button>';
				myE2.append(result);
				angular.element(myE2).injector().invoke(function($compile){
					var scope=angular.element(myE2).scope();
					$compile(myE2.contents())(scope);
				});
			}
			else if(yres[key].score>=50 && yres[key].score<75)
			{
				amount=5;
				pagespeedArray.push({"name":"Avoid URL redirects","score":yres[key].score,"amount":amount,"shortName":"yredirects1"});
				$scope.yredirectsColor="background-color:#5C9BD1;color:white";
				$scope.yredirectsScore=yres[key].score;
				var myE2 = angular.element(document.querySelector('#yredirectsCart'));
				var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Avoid URL redirects'"+','+amount+","+"'yredirects1'"+')"  class="pull-right removeCart" ng-hide="yredirects1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Avoid URL redirects'"+','+amount+","+"'yredirects1'"+')"  class="pull-right addCartClass" ng-show="yredirects1.show">'+'Add Item</button>';
				myE2.append(result);
				angular.element(myE2).injector().invoke(function($compile){
					var scope=angular.element(myE2).scope();
					$compile(myE2.contents())(scope);
				});
			}
			else if(yres[key].score>=75 && yres[key].score<90)
			{
				amount=5;
				pagespeedArray.push({"name":"Avoid URL redirects","score":yres[key].score,"amount":amount,"shortName":"yredirects1"});
				$scope.yredirectsColor="background-color:#5C9BD1;color:white";
				$scope.yredirectsScore=yres[key].score;
				var myE2 = angular.element(document.querySelector('#yredirectsCart'));
				var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Avoid URL redirects'"+','+amount+","+"'yredirects1'"+')"  class="pull-right removeCart" ng-hide="yredirects1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Avoid URL redirects'"+','+amount+","+"'yredirects1'"+')"  class="pull-right addCartClass" ng-show="yredirects1.show">'+'Add Item</button>';
				myE2.append(result);
				angular.element(myE2).injector().invoke(function($compile){
					var scope=angular.element(myE2).scope();
					$compile(myE2.contents())(scope);
				});
			}
			else if(yres[key].score>=90 && yres[key].score<100)
			{
				amount=5;
				pagespeedArray.push({"name":"Avoid URL redirects","score":yres[key].score,"amount":amount,"shortName":"yredirects1"});
				$scope.yredirectsColor="background-color:#4DB3A2;color:white";
				$scope.yredirectsScore=yres[key].score;
				var myE2 = angular.element(document.querySelector('#yredirectsCart'));
				var result= '<button id="btncart_'+i+'" ng-click="toggleActive('+yres[key].score+','+"'Avoid URL redirects'"+','+amount+","+"'yredirects1'"+')"  class="pull-right removeCart" ng-hide="yredirects1.hide">'+'Remove Item</button>'+'<button id="btncart_'+i+'" ng-click="addCartFun('+yres[key].score+','+"'Avoid URL redirects'"+','+amount+","+"'yredirects1'"+')"  class="pull-right addCartClass" ng-show="yredirects1.show">'+'Add Item</button>';
				myE2.append(result);
				angular.element(myE2).injector().invoke(function($compile){
					var scope=angular.element(myE2).scope();
					$compile(myE2.contents())(scope);
				});
			}
			else if(yres[key].score==100)
			{
				$scope.yredirectsColor="background-color:#4DB3A2;color:white";
				$scope.yredirectsScore=yres[key].score;
			}
			if(yres[key].components.length!=0)
			{
				$("#yredirectsHeading").append(yslow.g.yredirects.message);
				considerFix_p_c19=document.getElementById("considerFix_p_c19");
				for(var i=0;i<yres[key].components.length;i++)
				{
					if(yres[key].components[i]!=undefined)
					{
						considerFix_p_c19.innerHTML = "<a href="+yres[key].components[i]+" target='_blank'>"+considerFix_p_c19.innerHTML+"<li>"+yres[key].components[i]+"</a>";
					}
				}
			}
			else
			{
				$("#yredirectsHeading").append("<p style='color:black'>You scored 100% on this recommendation - nothing to do here!</p>")
			}
			considerFix_p_c19.innerHTML=considerFix_p_c19.innerHTML;
		}
	}
		localStorage.setItem("addCart",JSON.stringify(pagespeedArray));
					/*Yslow End */
		
		var totalData = JSON.parse(localStorage.getItem("addCart"));
		var data1=[];	
		var totalAmount=0;   
		var dataLength=totalData.length;
		var len;
		if(dataLength%2==0)
		{
			len=dataLength/2;
		}
		else
		{
			len=Math.round(dataLength/2);
	
		}
		for(var i=0;i<len;i++)
		{
			if(totalData[i]!=undefined)
			{
				data1.push({"name":totalData[i].name,"score":totalData[i].score,"amount":totalData[i].amount,"shortName":totalData[i].shortName});
				totalAmount=totalAmount+totalData[i].amount;
			}
		}
		$scope.pagespeedData1=data1;
		var dataLength=totalData.length;
		var data=[];
		for(var i=len;i<dataLength;i++)
		{
			if(totalData[i]!=undefined)
			{
				data.push({"name":totalData[i].name,"score":totalData[i].score,"amount":totalData[i].amount,"shortName":totalData[i].shortName});
				totalAmount=totalAmount+totalData[i].amount;
			}
		}
		$scope.totalAmount=totalAmount;
		$scope.pagespeedData=data;
		var removeDataFinal = JSON.parse(localStorage.getItem("removCart"));
		if(removeDataFinal!=null)
		{
			for(var i=0;i<totalData.length;i++)
			{
				if(totalData[i]!=undefined)
				{
					for(var k=0;k<removeDataFinal.length;k++)
					{
						if(removeDataFinal[k]!=undefined && totalData[i]!=undefined)
						{
							if(totalData[i].name==removeDataFinal[k].name)
							{
								totalData.splice(i,1);
							}
						}
					}
				}
			}
			for(var j=0;j<removeDataFinal.length;j++)
			{
				if(removeDataFinal[j]!=undefined)
				{
					var the_string = removeDataFinal[j].shortName+'.hide';
					var the_string1 = removeDataFinal[j].shortName+'.show';
					var model = $parse(the_string);
					var model1 = $parse(the_string1);
					model1.assign($scope, true);
					model.assign($scope, true);
				}
			}
			localStorage.setItem("removCart",JSON.stringify(removeDataFinal));
		}
		localStorage.setItem("addCart",JSON.stringify(totalData));
	};
	//RemoveFromCart function
	$scope.toggleActive = function(score,name,amount,shortName,$event)
	{
		//hide remove cart button
		event.stopPropagation();
		var the_string = shortName+'.hide';
		var the_string1 = shortName+'.show';
		var model = $parse(the_string);
		var model1 = $parse(the_string1);
	    model1.assign($scope, true);
		model.assign($scope, true);
		var addCartData = JSON.parse(localStorage.getItem('addCart'));
		var removeElements = JSON.parse(localStorage.getItem('removCart'))
		if(removeElements==null){
			 removeElements =[];
		}
		for(var i=0;i<addCartData.length;i++)
		{
			if(addCartData[i]!=undefined){
				if(addCartData[i].name==name)
				{
					removeElements.push({"name":name,"score":score,"amount":amount,"shortName":shortName});
					addCartData.splice(i,1);
				}
			}
		}
		localStorage.setItem("removCart",JSON.stringify(removeElements));
		localStorage.setItem('addCart',JSON.stringify(addCartData));
		$scope.headerCompiled=false;
		var cardNewData=JSON.parse(localStorage.getItem("addCart"));
		if(cardNewData==""){
			$scope.showBtn=true;
		}
	}
	$scope.addCartFun = function(score,name,amount,shortName,$event)
	{
		event.stopPropagation();
		var the_string = shortName+'.hide';
		var the_string1 = shortName+'.show';
		var model = $parse(the_string);
		var model1 = $parse(the_string1);
	    model1.assign($scope, false);
		model.assign($scope, false);
		var cardData=JSON.parse(localStorage.getItem('addCart'));
		 var remveElements = JSON.parse(localStorage.getItem("removCart"));
		 if(cardData==null){
			 cardData =[];
		}
		for(var i=0;i<remveElements.length;i++)
		{
			if(remveElements[i]!=undefined){
				if(remveElements[i].name==name)
				{
					remveElements.splice(i,1);
					cardData.push({"name":name,"score":score,"amount":amount,"shortName":shortName});
				}	
			}
		}
		localStorage.setItem("addCart",JSON.stringify(cardData));
		localStorage.setItem("removCart",JSON.stringify(remveElements));
		var cardNewData=JSON.parse(localStorage.getItem("addCart"));
		if(cardNewData!=""){
			$scope.showBtn=false;
		}
	}
}]);
//Amount controller
angular.module('pagespeed')
.controller('amountctrl',['$scope','$http','$location','$cookies',function($scope,$http,$location,$cookies,$localStorage,$interval){
	$scope.fun = function()
	{
		var totalData = JSON.parse(localStorage.getItem("addCart"));
		var removeData = JSON.parse(localStorage.getItem("removCart"));
		var data=[];
		var totalAmount=0;
		if(totalData!=null){
			for(var i=0;i<totalData.length;i++)
			{
				if(totalData[i]!=undefined)
				{
					data.push({"name":totalData[i].name,"score":totalData[i].score,"amount":totalData[i].amount,"shortName":totalData[i].shortName});
					totalAmount=totalAmount+totalData[i].amount;
				}
			}
		}
		$scope.totalAmount=totalAmount;
		$scope.pagespeedData=data;
	};
	$scope.fun();
}]); 
