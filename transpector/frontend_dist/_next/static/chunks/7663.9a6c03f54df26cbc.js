"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7663],{26028:function(e,n,t){t.r(n),t.d(n,{fcl:function(){return d}});var r={term:!0,method:!0,accu:!0,rule:!0,then:!0,is:!0,and:!0,or:!0,if:!0,default:!0},o={var_input:!0,var_output:!0,fuzzify:!0,defuzzify:!0,function_block:!0,ruleblock:!0},i={end_ruleblock:!0,end_defuzzify:!0,end_function_block:!0,end_fuzzify:!0,end_var:!0},a={true:!0,false:!0,nan:!0,real:!0,min:!0,max:!0,cog:!0,cogs:!0},u=/[+\-*&^%:=<>!|\/]/;function l(e,n){var t=e.next();if(/[\d\.]/.test(t))return"."==t?e.match(/^[0-9]+([eE][\-+]?[0-9]+)?/):"0"==t?e.match(/^[xX][0-9a-fA-F]+/)||e.match(/^0[0-7]+/):e.match(/^[0-9]*\.?[0-9]*([eE][\-+]?[0-9]+)?/),"number";if("/"==t||"("==t){if(e.eat("*"))return n.tokenize=c,c(e,n);if(e.eat("/"))return e.skipToEnd(),"comment"}if(u.test(t))return e.eatWhile(u),"operator";e.eatWhile(/[\w\$_\xa1-\uffff]/);var l=e.current().toLowerCase();return r.propertyIsEnumerable(l)||o.propertyIsEnumerable(l)||i.propertyIsEnumerable(l)?"keyword":a.propertyIsEnumerable(l)?"atom":"variable"}function c(e,n){for(var t,r=!1;t=e.next();){if(("/"==t||")"==t)&&r){n.tokenize=l;break}r="*"==t}return"comment"}function f(e,n,t,r,o){this.indented=e,this.column=n,this.type=t,this.align=r,this.prev=o}let d={name:"fcl",startState:function(e){return{tokenize:null,context:new f(-e,0,"top",!1),indented:0,startOfLine:!0}},token:function(e,n){var t,r,a,u=n.context;if(e.sol()&&(null==u.align&&(u.align=!1),n.indented=e.indentation(),n.startOfLine=!0),e.eatSpace())return null;var c=(n.tokenize||l)(e,n);if("comment"==c)return c;null==u.align&&(u.align=!0);var d=e.current().toLowerCase();return o.propertyIsEnumerable(d)?(r=n,a=e.column(),r.context=new f(r.indented,a,"end_block",null,r.context)):i.propertyIsEnumerable(d)&&(t=n).context.prev&&("end_block"==t.context.type&&(t.indented=t.context.indented),t.context=t.context.prev),n.startOfLine=!1,c},indent:function(e,n,t){if(e.tokenize!=l&&null!=e.tokenize)return 0;var r=e.context,o=i.propertyIsEnumerable(n);return r.align?r.column+(o?0:1):r.indented+(o?0:t.unit)},languageData:{commentTokens:{line:"//",block:{open:"(*",close:"*)"}}}}}}]);