"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3804],{13804:function(e,t,a){a.r(t),a.d(t,{autoCloseTags:function(){return ei},html:function(){return eo},htmlCompletionSource:function(){return et},htmlCompletionSourceWith:function(){return ea},htmlLanguage:function(){return es},htmlPlain:function(){return er}});var n=a(53105),l=a(35524),r=a(41113);let s={area:!0,base:!0,br:!0,col:!0,command:!0,embed:!0,frame:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0,menuitem:!0},o={dd:!0,li:!0,optgroup:!0,option:!0,p:!0,rp:!0,rt:!0,tbody:!0,td:!0,tfoot:!0,th:!0,tr:!0},O={dd:{dd:!0,dt:!0},dt:{dd:!0,dt:!0},li:{li:!0},option:{option:!0,optgroup:!0},optgroup:{optgroup:!0},p:{address:!0,article:!0,aside:!0,blockquote:!0,dir:!0,div:!0,dl:!0,fieldset:!0,footer:!0,form:!0,h1:!0,h2:!0,h3:!0,h4:!0,h5:!0,h6:!0,header:!0,hgroup:!0,hr:!0,menu:!0,nav:!0,ol:!0,p:!0,pre:!0,section:!0,table:!0,ul:!0},rp:{rp:!0,rt:!0},rt:{rp:!0,rt:!0},tbody:{tbody:!0,tfoot:!0},td:{td:!0,th:!0},tfoot:{tbody:!0},th:{td:!0,th:!0},thead:{tbody:!0,tfoot:!0},tr:{tr:!0}};function i(e){return 9==e||10==e||13==e||32==e}let p=null,u=null,c=0;function d(e,t){var a;let n=e.pos+t;if(c==n&&u==e)return p;let l=e.peek(t);for(;i(l);)l=e.peek(++t);let r="";for(;45==(a=l)||46==a||58==a||a>=65&&a<=90||95==a||a>=97&&a<=122||a>=161;)r+=String.fromCharCode(l),l=e.peek(++t);return u=e,c=n,p=r?r.toLowerCase():l==f||l==h?void 0:null}let f=63,h=33;function m(e,t){this.name=e,this.parent=t,this.hash=t?t.hash:0;for(let t=0;t<e.length;t++)this.hash+=(this.hash<<4)+e.charCodeAt(t)+(e.charCodeAt(t)<<8)}let S=[6,10,7,8,9],g=new n.IK({start:null,shift:(e,t,a,n)=>S.indexOf(t)>-1?new m(d(n,1)||"",e):e,reduce:(e,t)=>20==t&&e?e.parent:e,reuse(e,t,a,n){let l=t.type.id;return 6==l||36==l?new m(d(n,1)||"",e):e},hash:e=>e?e.hash:0,strict:!1}),P=new n.Jq((e,t)=>{if(60!=e.next){e.next<0&&t.context&&e.acceptToken(57);return}e.advance();let a=47==e.next;a&&e.advance();let n=d(e,0);if(void 0===n)return;if(!n)return e.acceptToken(a?14:6);let l=t.context?t.context.name:null;if(a){if(n==l)return e.acceptToken(11);if(l&&o[l])return e.acceptToken(57,-2);if(t.dialectEnabled(0))return e.acceptToken(12);for(let e=t.context;e;e=e.parent)if(e.name==n)return;e.acceptToken(13)}else{if("script"==n)return e.acceptToken(7);if("style"==n)return e.acceptToken(8);if("textarea"==n)return e.acceptToken(9);if(s.hasOwnProperty(n))return e.acceptToken(10);l&&O[l]&&O[l][n]?e.acceptToken(57,-1):e.acceptToken(6)}},{contextual:!0}),x=new n.Jq(e=>{for(let t=0,a=0;;a++){if(e.next<0){a&&e.acceptToken(58);break}if(45==e.next)t++;else if(62==e.next&&t>=2){a>3&&e.acceptToken(58,-2);break}else t=0;e.advance()}}),V=new n.Jq((e,t)=>{if(47==e.next&&62==e.peek(1)){let a=t.dialectEnabled(1)||function(e){for(;e;e=e.parent)if("svg"==e.name||"math"==e.name)return!0;return!1}(t.context);e.acceptToken(a?5:4,2)}else 62==e.next&&e.acceptToken(4,1)});function b(e,t,a){let l=2+e.length;return new n.Jq(n=>{for(let r=0,s=0,o=0;;o++){if(n.next<0){o&&n.acceptToken(t);break}if(0==r&&60==n.next||1==r&&47==n.next||r>=2&&r<l&&n.next==e.charCodeAt(r-2))r++,s++;else if((2==r||r==l)&&i(n.next))s++;else if(r==l&&62==n.next){o>s?n.acceptToken(t,-s):n.acceptToken(a,-(s-2));break}else if((10==n.next||13==n.next)&&o){n.acceptToken(t,1);break}else r=s=0;n.advance()}})}let _=b("script",54,1),v=b("style",55,2),q=b("textarea",56,3),T=(0,l.Gv)({"Text RawText":l.pJ.content,"StartTag StartCloseTag SelfClosingEndTag EndTag":l.pJ.angleBracket,TagName:l.pJ.tagName,"MismatchedCloseTag/TagName":[l.pJ.tagName,l.pJ.invalid],AttributeName:l.pJ.attributeName,"AttributeValue UnquotedAttributeValue":l.pJ.attributeValue,Is:l.pJ.definitionOperator,"EntityReference CharacterReference":l.pJ.character,Comment:l.pJ.blockComment,ProcessingInst:l.pJ.processingInstruction,DoctypeDecl:l.pJ.documentMeta}),y=n.WQ.deserialize({version:14,states:",xOVO!rOOO!WQ#tO'#CqO!]Q#tO'#CzO!bQ#tO'#C}O!gQ#tO'#DQO!lQ#tO'#DSO!qOaO'#CpO!|ObO'#CpO#XOdO'#CpO$eO!rO'#CpOOO`'#Cp'#CpO$lO$fO'#DTO$tQ#tO'#DVO$yQ#tO'#DWOOO`'#Dk'#DkOOO`'#DY'#DYQVO!rOOO%OQ&rO,59]O%WQ&rO,59fO%`Q&rO,59iO%hQ&rO,59lO%sQ&rO,59nOOOa'#D^'#D^O%{OaO'#CxO&WOaO,59[OOOb'#D_'#D_O&`ObO'#C{O&kObO,59[OOOd'#D`'#D`O&sOdO'#DOO'OOdO,59[OOO`'#Da'#DaO'WO!rO,59[O'_Q#tO'#DROOO`,59[,59[OOOp'#Db'#DbO'dO$fO,59oOOO`,59o,59oO'lQ#|O,59qO'qQ#|O,59rOOO`-E7W-E7WO'vQ&rO'#CsOOQW'#DZ'#DZO(UQ&rO1G.wOOOa1G.w1G.wO(^Q&rO1G/QOOOb1G/Q1G/QO(fQ&rO1G/TOOOd1G/T1G/TO(nQ&rO1G/WOOO`1G/W1G/WOOO`1G/Y1G/YO(yQ&rO1G/YOOOa-E7[-E7[O)RQ#tO'#CyOOO`1G.v1G.vOOOb-E7]-E7]O)WQ#tO'#C|OOOd-E7^-E7^O)]Q#tO'#DPOOO`-E7_-E7_O)bQ#|O,59mOOOp-E7`-E7`OOO`1G/Z1G/ZOOO`1G/]1G/]OOO`1G/^1G/^O)gQ,UO,59_OOQW-E7X-E7XOOOa7+$c7+$cOOOb7+$l7+$lOOOd7+$o7+$oOOO`7+$r7+$rOOO`7+$t7+$tO)rQ#|O,59eO)wQ#|O,59hO)|Q#|O,59kOOO`1G/X1G/XO*RO7[O'#CvO*dOMhO'#CvOOQW1G.y1G.yOOO`1G/P1G/POOO`1G/S1G/SOOO`1G/V1G/VOOOO'#D['#D[O*uO7[O,59bOOQW,59b,59bOOOO'#D]'#D]O+WOMhO,59bOOOO-E7Y-E7YOOQW1G.|1G.|OOOO-E7Z-E7Z",stateData:"+s~O!^OS~OUSOVPOWQOXROYTO[]O][O^^O`^Oa^Ob^Oc^Ox^O{_O!dZO~OfaO~OfbO~OfcO~OfdO~OfeO~O!WfOPlP!ZlP~O!XiOQoP!ZoP~O!YlORrP!ZrP~OUSOVPOWQOXROYTOZqO[]O][O^^O`^Oa^Ob^Oc^Ox^O!dZO~O!ZrO~P#dO![sO!euO~OfvO~OfwO~OS|OhyO~OS!OOhyO~OS!QOhyO~OS!SOT!TOhyO~OS!TOhyO~O!WfOPlX!ZlX~OP!WO!Z!XO~O!XiOQoX!ZoX~OQ!ZO!Z!XO~O!YlORrX!ZrX~OR!]O!Z!XO~O!Z!XO~P#dOf!_O~O![sO!e!aO~OS!bO~OS!cO~Oi!dOSgXhgXTgX~OS!fOhyO~OS!gOhyO~OS!hOhyO~OS!iOT!jOhyO~OS!jOhyO~Of!kO~Of!lO~Of!mO~OS!nO~Ok!qO!`!oO!b!pO~OS!rO~OS!sO~OS!tO~Oa!uOb!uOc!uO!`!wO!a!uO~Oa!xOb!xOc!xO!b!wO!c!xO~Oa!uOb!uOc!uO!`!{O!a!uO~Oa!xOb!xOc!xO!b!{O!c!xO~OT~bac!dx{!d~",goto:"%p!`PPPPPPPPPPPPPPPPPPPP!a!gP!mPP!yP!|#P#S#Y#]#`#f#i#l#r#x!aP!a!aP$O$U$l$r$x%O%U%[%bPPPPPPPP%hX^OX`pXUOX`pezabcde{}!P!R!UR!q!dRhUR!XhXVOX`pRkVR!XkXWOX`pRnWR!XnXXOX`pQrXR!XpXYOX`pQ`ORx`Q{aQ}bQ!PcQ!RdQ!UeZ!e{}!P!R!UQ!v!oR!z!vQ!y!pR!|!yQgUR!VgQjVR!YjQmWR![mQpXR!^pQtZR!`tS_O`ToXp",nodeNames:"⚠ StartCloseTag StartCloseTag StartCloseTag EndTag SelfClosingEndTag StartTag StartTag StartTag StartTag StartTag StartCloseTag StartCloseTag StartCloseTag IncompleteCloseTag Document Text EntityReference CharacterReference InvalidEntity Element OpenTag TagName Attribute AttributeName Is AttributeValue UnquotedAttributeValue ScriptText CloseTag OpenTag StyleText CloseTag OpenTag TextareaText CloseTag OpenTag CloseTag SelfClosingTag Comment ProcessingInst MismatchedCloseTag CloseTag DoctypeDecl",maxTerm:67,context:g,nodeProps:[["closedBy",-10,1,2,3,7,8,9,10,11,12,13,"EndTag",6,"EndTag SelfClosingEndTag",-4,21,30,33,36,"CloseTag"],["openedBy",4,"StartTag StartCloseTag",5,"StartTag",-4,29,32,35,37,"OpenTag"],["group",-9,14,17,18,19,20,39,40,41,42,"Entity",16,"Entity TextContent",-3,28,31,34,"TextContent Entity"]],propSources:[T],skippedNodes:[0],repeatNodeCount:9,tokenData:"#%g!aR!YOX$qXY,QYZ,QZ[$q[]&X]^,Q^p$qpq,Qqr-_rs4ysv-_vw5iwxJ^x}-_}!OKP!O!P-_!P!Q$q!Q![-_![!]!!O!]!^-_!^!_!&W!_!`#$o!`!a&X!a!c-_!c!}!!O!}#R-_#R#S!!O#S#T3V#T#o!!O#o#s-_#s$f$q$f%W-_%W%o!!O%o%p-_%p&a!!O&a&b-_&b1p!!O1p4U-_4U4d!!O4d4e-_4e$IS!!O$IS$I`-_$I`$Ib!!O$Ib$Kh-_$Kh%#t!!O%#t&/x-_&/x&Et!!O&Et&FV-_&FV;'S!!O;'S;:j!&Q;:j;=`4s<%l?&r-_?&r?Ah!!O?Ah?BY$q?BY?Mn!!O?MnO$q!Z$|c`PkW!a`!cpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr$qrs&}sv$qvw+Pwx(tx!^$q!^!_*V!_!a&X!a#S$q#S#T&X#T;'S$q;'S;=`+z<%lO$q!R&bX`P!a`!cpOr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&Xq'UV`P!cpOv&}wx'kx!^&}!^!_(V!_;'S&};'S;=`(n<%lO&}P'pT`POv'kw!^'k!_;'S'k;'S;=`(P<%lO'kP(SP;=`<%l'kp([S!cpOv(Vx;'S(V;'S;=`(h<%lO(Vp(kP;=`<%l(Vq(qP;=`<%l&}a({W`P!a`Or(trs'ksv(tw!^(t!^!_)e!_;'S(t;'S;=`*P<%lO(t`)jT!a`Or)esv)ew;'S)e;'S;=`)y<%lO)e`)|P;=`<%l)ea*SP;=`<%l(t!Q*^V!a`!cpOr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!Q*vP;=`<%l*V!R*|P;=`<%l&XW+UYkWOX+PZ[+P^p+Pqr+Psw+Px!^+P!a#S+P#T;'S+P;'S;=`+t<%lO+PW+wP;=`<%l+P!Z+}P;=`<%l$q!a,]``P!a`!cp!^^OX&XXY,QYZ,QZ]&X]^,Q^p&Xpq,Qqr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&X!_-ljhS`PkW!a`!cpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx!P-_!P!Q$q!Q!^-_!^!_1n!_!a&X!a#S-_#S#T3V#T#s-_#s$f$q$f;'S-_;'S;=`4s<%l?Ah-_?Ah?BY$q?BY?Mn-_?MnO$q[/echSkWOX+PZ[+P^p+Pqr/^sw/^x!P/^!P!Q+P!Q!^/^!^!_0p!a#S/^#S#T0p#T#s/^#s$f+P$f;'S/^;'S;=`1h<%l?Ah/^?Ah?BY+P?BY?Mn/^?MnO+PS0uXhSqr0psw0px!P0p!Q!_0p!a#s0p$f;'S0p;'S;=`1b<%l?Ah0p?BY?Mn0pS1eP;=`<%l0p[1kP;=`<%l/^!U1wbhS!a`!cpOq*Vqr1nrs(Vsv1nvw0pwx)ex!P1n!P!Q*V!Q!_1n!_!a*V!a#s1n#s$f*V$f;'S1n;'S;=`3P<%l?Ah1n?Ah?BY*V?BY?Mn1n?MnO*V!U3SP;=`<%l1n!V3bchS`P!a`!cpOq&Xqr3Vrs&}sv3Vvw0pwx(tx!P3V!P!Q&X!Q!^3V!^!_1n!_!a&X!a#s3V#s$f&X$f;'S3V;'S;=`4m<%l?Ah3V?Ah?BY&X?BY?Mn3V?MnO&X!V4pP;=`<%l3V!_4vP;=`<%l-_!Z5SV!`h`P!cpOv&}wx'kx!^&}!^!_(V!_;'S&};'S;=`(n<%lO&}!_5rjhSkWc!ROX7dXZ8qZ[7d[^8q^p7dqr:crs8qst@Ttw:cwx8qx!P:c!P!Q7d!Q!]:c!]!^/^!^!_=p!_!a8q!a#S:c#S#T=p#T#s:c#s$f7d$f;'S:c;'S;=`?}<%l?Ah:c?Ah?BY7d?BY?Mn:c?MnO7d!Z7ibkWOX7dXZ8qZ[7d[^8q^p7dqr7drs8qst+Ptw7dwx8qx!]7d!]!^9f!^!a8q!a#S7d#S#T8q#T;'S7d;'S;=`:]<%lO7d!R8tVOp8qqs8qt!]8q!]!^9Z!^;'S8q;'S;=`9`<%lO8q!R9`Oa!R!R9cP;=`<%l8q!Z9mYkWa!ROX+PZ[+P^p+Pqr+Psw+Px!^+P!a#S+P#T;'S+P;'S;=`+t<%lO+P!Z:`P;=`<%l7d!_:jjhSkWOX7dXZ8qZ[7d[^8q^p7dqr:crs8qst/^tw:cwx8qx!P:c!P!Q7d!Q!]:c!]!^<[!^!_=p!_!a8q!a#S:c#S#T=p#T#s:c#s$f7d$f;'S:c;'S;=`?}<%l?Ah:c?Ah?BY7d?BY?Mn:c?MnO7d!_<echSkWa!ROX+PZ[+P^p+Pqr/^sw/^x!P/^!P!Q+P!Q!^/^!^!_0p!a#S/^#S#T0p#T#s/^#s$f+P$f;'S/^;'S;=`1h<%l?Ah/^?Ah?BY+P?BY?Mn/^?MnO+P!V=udhSOp8qqr=prs8qst0ptw=pwx8qx!P=p!P!Q8q!Q!]=p!]!^?T!^!_=p!_!a8q!a#s=p#s$f8q$f;'S=p;'S;=`?w<%l?Ah=p?Ah?BY8q?BY?Mn=p?MnO8q!V?[XhSa!Rqr0psw0px!P0p!Q!_0p!a#s0p$f;'S0p;'S;=`1b<%l?Ah0p?BY?Mn0p!V?zP;=`<%l=p!_@QP;=`<%l:c!_@[ihSkWOXAyXZCTZ[Ay[^CT^pAyqrDrrsCTswDrwxCTx!PDr!P!QAy!Q!]Dr!]!^/^!^!_G|!_!aCT!a#SDr#S#TG|#T#sDr#s$fAy$f;'SDr;'S;=`JW<%l?AhDr?Ah?BYAy?BY?MnDr?MnOAy!ZBOakWOXAyXZCTZ[Ay[^CT^pAyqrAyrsCTswAywxCTx!]Ay!]!^Cu!^!aCT!a#SAy#S#TCT#T;'SAy;'S;=`Dl<%lOAy!RCWUOpCTq!]CT!]!^Cj!^;'SCT;'S;=`Co<%lOCT!RCoOb!R!RCrP;=`<%lCT!ZC|YkWb!ROX+PZ[+P^p+Pqr+Psw+Px!^+P!a#S+P#T;'S+P;'S;=`+t<%lO+P!ZDoP;=`<%lAy!_DyihSkWOXAyXZCTZ[Ay[^CT^pAyqrDrrsCTswDrwxCTx!PDr!P!QAy!Q!]Dr!]!^Fh!^!_G|!_!aCT!a#SDr#S#TG|#T#sDr#s$fAy$f;'SDr;'S;=`JW<%l?AhDr?Ah?BYAy?BY?MnDr?MnOAy!_FqchSkWb!ROX+PZ[+P^p+Pqr/^sw/^x!P/^!P!Q+P!Q!^/^!^!_0p!a#S/^#S#T0p#T#s/^#s$f+P$f;'S/^;'S;=`1h<%l?Ah/^?Ah?BY+P?BY?Mn/^?MnO+P!VHRchSOpCTqrG|rsCTswG|wxCTx!PG|!P!QCT!Q!]G|!]!^I^!^!_G|!_!aCT!a#sG|#s$fCT$f;'SG|;'S;=`JQ<%l?AhG|?Ah?BYCT?BY?MnG|?MnOCT!VIeXhSb!Rqr0psw0px!P0p!Q!_0p!a#s0p$f;'S0p;'S;=`1b<%l?Ah0p?BY?Mn0p!VJTP;=`<%lG|!_JZP;=`<%lDr!ZJgW!bx`P!a`Or(trs'ksv(tw!^(t!^!_)e!_;'S(t;'S;=`*P<%lO(t!aK^lhS`PkW!a`!cpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx}-_}!OMU!O!P-_!P!Q$q!Q!^-_!^!_1n!_!a&X!a#S-_#S#T3V#T#s-_#s$f$q$f;'S-_;'S;=`4s<%l?Ah-_?Ah?BY$q?BY?Mn-_?MnO$q!aMckhS`PkW!a`!cpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx!P-_!P!Q$q!Q!^-_!^!_1n!_!`&X!`!a! W!a#S-_#S#T3V#T#s-_#s$f$q$f;'S-_;'S;=`4s<%l?Ah-_?Ah?BY$q?BY?Mn-_?MnO$q!T! cX`P!a`!cp!eQOr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&X!a!!_!ZhSfQ`PkW!a`!cpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx}-_}!O!!O!O!P!!O!P!Q$q!Q![!!O![!]!!O!]!^-_!^!_1n!_!a&X!a!c-_!c!}!!O!}#R-_#R#S!!O#S#T3V#T#o!!O#o#s-_#s$f$q$f$}-_$}%O!!O%O%W-_%W%o!!O%o%p-_%p&a!!O&a&b-_&b1p!!O1p4U!!O4U4d!!O4d4e-_4e$IS!!O$IS$I`-_$I`$Ib!!O$Ib$Je-_$Je$Jg!!O$Jg$Kh-_$Kh%#t!!O%#t&/x-_&/x&Et!!O&Et&FV-_&FV;'S!!O;'S;:j!&Q;:j;=`4s<%l?&r-_?&r?Ah!!O?Ah?BY$q?BY?Mn!!O?MnO$q!a!&TP;=`<%l!!O!V!&achS!a`!cpOq*Vqr!'lrs(Vsv1nvw0pwx)ex!P1n!P!Q*V!Q!_1n!_!a*V!a!b!Ey!b#s1n#s$f*V$f;'S1n;'S;=`3P<%l?Ah1n?Ah?BY*V?BY?Mn1n?MnO*V!V!'uhhS!a`!cpOq*Vqr1nrs(Vsv1nvw0pwx)ex}1n}!O!)a!O!P1n!P!Q*V!Q!_1n!_!a*V!a!f1n!f!g!,]!g#W1n#W#X!<y#X#s1n#s$f*V$f;'S1n;'S;=`3P<%l?Ah1n?Ah?BY*V?BY?Mn1n?MnO*V!V!)jdhS!a`!cpOq*Vqr1nrs(Vsv1nvw0pwx)ex}1n}!O!*x!O!P1n!P!Q*V!Q!_1n!_!a*V!a#s1n#s$f*V$f;'S1n;'S;=`3P<%l?Ah1n?Ah?BY*V?BY?Mn1n?MnO*V!V!+TbhS!a`!cp!dPOq*Vqr1nrs(Vsv1nvw0pwx)ex!P1n!P!Q*V!Q!_1n!_!a*V!a#s1n#s$f*V$f;'S1n;'S;=`3P<%l?Ah1n?Ah?BY*V?BY?Mn1n?MnO*V!V!,fdhS!a`!cpOq*Vqr1nrs(Vsv1nvw0pwx)ex!P1n!P!Q*V!Q!_1n!_!a*V!a!q1n!q!r!-t!r#s1n#s$f*V$f;'S1n;'S;=`3P<%l?Ah1n?Ah?BY*V?BY?Mn1n?MnO*V!V!-}dhS!a`!cpOq*Vqr1nrs(Vsv1nvw0pwx)ex!P1n!P!Q*V!Q!_1n!_!a*V!a!e1n!e!f!/]!f#s1n#s$f*V$f;'S1n;'S;=`3P<%l?Ah1n?Ah?BY*V?BY?Mn1n?MnO*V!V!/fdhS!a`!cpOq*Vqr1nrs(Vsv1nvw0pwx)ex!P1n!P!Q*V!Q!_1n!_!a*V!a!v1n!v!w!0t!w#s1n#s$f*V$f;'S1n;'S;=`3P<%l?Ah1n?Ah?BY*V?BY?Mn1n?MnO*V!V!0}dhS!a`!cpOq*Vqr1nrs(Vsv1nvw0pwx)ex!P1n!P!Q*V!Q!_1n!_!a*V!a!{1n!{!|!2]!|#s1n#s$f*V$f;'S1n;'S;=`3P<%l?Ah1n?Ah?BY*V?BY?Mn1n?MnO*V!V!2fdhS!a`!cpOq*Vqr1nrs(Vsv1nvw0pwx)ex!P1n!P!Q*V!Q!_1n!_!a*V!a!r1n!r!s!3t!s#s1n#s$f*V$f;'S1n;'S;=`3P<%l?Ah1n?Ah?BY*V?BY?Mn1n?MnO*V!V!3}dhS!a`!cpOq*Vqr1nrs(Vsv1nvw0pwx)ex!P1n!P!Q*V!Q!_1n!_!a*V!a!g1n!g!h!5]!h#s1n#s$f*V$f;'S1n;'S;=`3P<%l?Ah1n?Ah?BY*V?BY?Mn1n?MnO*V!V!5fchS!a`!cpOq!6qqr!5]rs!7hsv!5]vw!;`wx!9[x!P!5]!P!Q!6q!Q!_!5]!_!`!6q!`!a!:j!a#s!5]#s$f!6q$f;'S!5];'S;=`!<s<%l?Ah!5]?Ah?BY!6q?BY?Mn!5]?MnO!6q!R!6xY!a`!cpOr!6qrs!7hsv!6qvw!8Swx!9[x!`!6q!`!a!:j!a;'S!6q;'S;=`!;Y<%lO!6qq!7mV!cpOv!7hvx!8Sx!`!7h!`!a!8q!a;'S!7h;'S;=`!9U<%lO!7hP!8VTO!`!8S!`!a!8f!a;'S!8S;'S;=`!8k<%lO!8SP!8kO{PP!8nP;=`<%l!8Sq!8xS!cp{POv(Vx;'S(V;'S;=`(h<%lO(Vq!9XP;=`<%l!7ha!9aX!a`Or!9[rs!8Ssv!9[vw!8Sw!`!9[!`!a!9|!a;'S!9[;'S;=`!:d<%lO!9[a!:TT!a`{POr)esv)ew;'S)e;'S;=`)y<%lO)ea!:gP;=`<%l!9[!R!:sV!a`!cp{POr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!R!;]P;=`<%l!6qT!;ebhSOq!8Sqr!;`rs!8Ssw!;`wx!8Sx!P!;`!P!Q!8S!Q!_!;`!_!`!8S!`!a!8f!a#s!;`#s$f!8S$f;'S!;`;'S;=`!<m<%l?Ah!;`?Ah?BY!8S?BY?Mn!;`?MnO!8ST!<pP;=`<%l!;`!V!<vP;=`<%l!5]!V!=SdhS!a`!cpOq*Vqr1nrs(Vsv1nvw0pwx)ex!P1n!P!Q*V!Q!_1n!_!a*V!a#c1n#c#d!>b#d#s1n#s$f*V$f;'S1n;'S;=`3P<%l?Ah1n?Ah?BY*V?BY?Mn1n?MnO*V!V!>kdhS!a`!cpOq*Vqr1nrs(Vsv1nvw0pwx)ex!P1n!P!Q*V!Q!_1n!_!a*V!a#V1n#V#W!?y#W#s1n#s$f*V$f;'S1n;'S;=`3P<%l?Ah1n?Ah?BY*V?BY?Mn1n?MnO*V!V!@SdhS!a`!cpOq*Vqr1nrs(Vsv1nvw0pwx)ex!P1n!P!Q*V!Q!_1n!_!a*V!a#h1n#h#i!Ab#i#s1n#s$f*V$f;'S1n;'S;=`3P<%l?Ah1n?Ah?BY*V?BY?Mn1n?MnO*V!V!AkdhS!a`!cpOq*Vqr1nrs(Vsv1nvw0pwx)ex!P1n!P!Q*V!Q!_1n!_!a*V!a#m1n#m#n!By#n#s1n#s$f*V$f;'S1n;'S;=`3P<%l?Ah1n?Ah?BY*V?BY?Mn1n?MnO*V!V!CSdhS!a`!cpOq*Vqr1nrs(Vsv1nvw0pwx)ex!P1n!P!Q*V!Q!_1n!_!a*V!a#d1n#d#e!Db#e#s1n#s$f*V$f;'S1n;'S;=`3P<%l?Ah1n?Ah?BY*V?BY?Mn1n?MnO*V!V!DkdhS!a`!cpOq*Vqr1nrs(Vsv1nvw0pwx)ex!P1n!P!Q*V!Q!_1n!_!a*V!a#X1n#X#Y!5]#Y#s1n#s$f*V$f;'S1n;'S;=`3P<%l?Ah1n?Ah?BY*V?BY?Mn1n?MnO*V!V!FSchS!a`!cpOq!G_qr!Eyrs!HUsv!Eyvw!Ncwx!Jvx!P!Ey!P!Q!G_!Q!_!Ey!_!a!G_!a!b##T!b#s!Ey#s$f!G_$f;'S!Ey;'S;=`#$i<%l?Ah!Ey?Ah?BY!G_?BY?Mn!Ey?MnO!G_!R!GfY!a`!cpOr!G_rs!HUsv!G_vw!Hpwx!Jvx!a!G_!a!b!Lv!b;'S!G_;'S;=`!N]<%lO!G_q!HZV!cpOv!HUvx!Hpx!a!HU!a!b!Iq!b;'S!HU;'S;=`!Jp<%lO!HUP!HsTO!a!Hp!a!b!IS!b;'S!Hp;'S;=`!Ik<%lO!HpP!IVTO!`!Hp!`!a!If!a;'S!Hp;'S;=`!Ik<%lO!HpP!IkOxPP!InP;=`<%l!Hpq!IvV!cpOv!HUvx!Hpx!`!HU!`!a!J]!a;'S!HU;'S;=`!Jp<%lO!HUq!JdS!cpxPOv(Vx;'S(V;'S;=`(h<%lO(Vq!JsP;=`<%l!HUa!J{X!a`Or!Jvrs!Hpsv!Jvvw!Hpw!a!Jv!a!b!Kh!b;'S!Jv;'S;=`!Lp<%lO!Jva!KmX!a`Or!Jvrs!Hpsv!Jvvw!Hpw!`!Jv!`!a!LY!a;'S!Jv;'S;=`!Lp<%lO!Jva!LaT!a`xPOr)esv)ew;'S)e;'S;=`)y<%lO)ea!LsP;=`<%l!Jv!R!L}Y!a`!cpOr!G_rs!HUsv!G_vw!Hpwx!Jvx!`!G_!`!a!Mm!a;'S!G_;'S;=`!N]<%lO!G_!R!MvV!a`!cpxPOr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!R!N`P;=`<%l!G_T!NhbhSOq!Hpqr!Ncrs!Hpsw!Ncwx!Hpx!P!Nc!P!Q!Hp!Q!_!Nc!_!a!Hp!a!b# p!b#s!Nc#s$f!Hp$f;'S!Nc;'S;=`#!}<%l?Ah!Nc?Ah?BY!Hp?BY?Mn!Nc?MnO!HpT# ubhSOq!Hpqr!Ncrs!Hpsw!Ncwx!Hpx!P!Nc!P!Q!Hp!Q!_!Nc!_!`!Hp!`!a!If!a#s!Nc#s$f!Hp$f;'S!Nc;'S;=`#!}<%l?Ah!Nc?Ah?BY!Hp?BY?Mn!Nc?MnO!HpT##QP;=`<%l!Nc!V##^chS!a`!cpOq!G_qr!Eyrs!HUsv!Eyvw!Ncwx!Jvx!P!Ey!P!Q!G_!Q!_!Ey!_!`!G_!`!a!Mm!a#s!Ey#s$f!G_$f;'S!Ey;'S;=`#$i<%l?Ah!Ey?Ah?BY!G_?BY?Mn!Ey?MnO!G_!V#$lP;=`<%l!Ey!V#$zXiS`P!a`!cpOr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&X",tokenizers:[_,v,q,V,P,x,0,1,2,3,4,5],topRules:{Document:[0,15]},dialects:{noMatch:0,selfClosing:485},tokenPrec:487});function $(e,t){let a=Object.create(null);for(let n of e.getChildren(23)){let e=n.getChild(24),l=n.getChild(26)||n.getChild(27);e&&(a[t.read(e.from,e.to)]=l?26==l.type.id?t.read(l.from+1,l.to-1):t.read(l.from,l.to):"")}return a}function w(e,t){let a=e.getChild(22);return a?t.read(a.from,a.to):" "}function Q(e,t,a){let n;for(let l of a)if(!l.attrs||l.attrs(n||(n=$(e.node.parent.firstChild,t))))return{parser:l.parser};return null}function X(e=[],t=[]){let a=[],n=[],l=[],s=[];for(let t of e)("script"==t.tag?a:"style"==t.tag?n:"textarea"==t.tag?l:s).push(t);let o=t.length?Object.create(null):null;for(let e of t)(o[e.name]||(o[e.name]=[])).push(e);return(0,r.FE)((e,t)=>{let r=e.type.id;if(28==r)return Q(e,t,a);if(31==r)return Q(e,t,n);if(34==r)return Q(e,t,l);if(20==r&&s.length){let a=e.node,n=a.firstChild,l=n&&w(n,t),r;if(l){for(let e of s)if(e.tag==l&&(!e.attrs||e.attrs(r||(r=$(a,t))))){let t=a.lastChild;return{parser:e.parser,overlay:[{from:n.to,to:37==t.type.id?t.from:a.to}]}}}}if(o&&23==r){let a=e.node,n;if(n=a.firstChild){let e=o[t.read(n.from,n.to)];if(e)for(let n of e){if(n.tagName&&n.tagName!=w(a.parent,t))continue;let e=a.lastChild;if(26==e.type.id){let t=e.from+1,a=e.lastChild,l=e.to-(a&&a.isError?0:1);if(l>t)return{parser:n.parser,overlay:[{from:t,to:l}]}}else if(27==e.type.id)return{parser:n.parser,overlay:[{from:e.from,to:e.to}]}}}}return null})}var A=a(61426),C=a(58037),k=a(47421),Y=a(78120),M=a(59119);let B=["_blank","_self","_top","_parent"],G=["ascii","utf-8","utf-16","latin1","latin1"],Z=["get","post","put","delete"],D=["application/x-www-form-urlencoded","multipart/form-data","text/plain"],E=["true","false"],R={},W={a:{attrs:{href:null,ping:null,type:null,media:null,target:B,hreflang:null}},abbr:R,address:R,area:{attrs:{alt:null,coords:null,href:null,target:null,ping:null,media:null,hreflang:null,type:null,shape:["default","rect","circle","poly"]}},article:R,aside:R,audio:{attrs:{src:null,mediagroup:null,crossorigin:["anonymous","use-credentials"],preload:["none","metadata","auto"],autoplay:["autoplay"],loop:["loop"],controls:["controls"]}},b:R,base:{attrs:{href:null,target:B}},bdi:R,bdo:R,blockquote:{attrs:{cite:null}},body:R,br:R,button:{attrs:{form:null,formaction:null,name:null,value:null,autofocus:["autofocus"],disabled:["autofocus"],formenctype:D,formmethod:Z,formnovalidate:["novalidate"],formtarget:B,type:["submit","reset","button"]}},canvas:{attrs:{width:null,height:null}},caption:R,center:R,cite:R,code:R,col:{attrs:{span:null}},colgroup:{attrs:{span:null}},command:{attrs:{type:["command","checkbox","radio"],label:null,icon:null,radiogroup:null,command:null,title:null,disabled:["disabled"],checked:["checked"]}},data:{attrs:{value:null}},datagrid:{attrs:{disabled:["disabled"],multiple:["multiple"]}},datalist:{attrs:{data:null}},dd:R,del:{attrs:{cite:null,datetime:null}},details:{attrs:{open:["open"]}},dfn:R,div:R,dl:R,dt:R,em:R,embed:{attrs:{src:null,type:null,width:null,height:null}},eventsource:{attrs:{src:null}},fieldset:{attrs:{disabled:["disabled"],form:null,name:null}},figcaption:R,figure:R,footer:R,form:{attrs:{action:null,name:null,"accept-charset":G,autocomplete:["on","off"],enctype:D,method:Z,novalidate:["novalidate"],target:B}},h1:R,h2:R,h3:R,h4:R,h5:R,h6:R,head:{children:["title","base","link","style","meta","script","noscript","command"]},header:R,hgroup:R,hr:R,html:{attrs:{manifest:null}},i:R,iframe:{attrs:{src:null,srcdoc:null,name:null,width:null,height:null,sandbox:["allow-top-navigation","allow-same-origin","allow-forms","allow-scripts"],seamless:["seamless"]}},img:{attrs:{alt:null,src:null,ismap:null,usemap:null,width:null,height:null,crossorigin:["anonymous","use-credentials"]}},input:{attrs:{alt:null,dirname:null,form:null,formaction:null,height:null,list:null,max:null,maxlength:null,min:null,name:null,pattern:null,placeholder:null,size:null,src:null,step:null,value:null,width:null,accept:["audio/*","video/*","image/*"],autocomplete:["on","off"],autofocus:["autofocus"],checked:["checked"],disabled:["disabled"],formenctype:D,formmethod:Z,formnovalidate:["novalidate"],formtarget:B,multiple:["multiple"],readonly:["readonly"],required:["required"],type:["hidden","text","search","tel","url","email","password","datetime","date","month","week","time","datetime-local","number","range","color","checkbox","radio","file","submit","image","reset","button"]}},ins:{attrs:{cite:null,datetime:null}},kbd:R,keygen:{attrs:{challenge:null,form:null,name:null,autofocus:["autofocus"],disabled:["disabled"],keytype:["RSA"]}},label:{attrs:{for:null,form:null}},legend:R,li:{attrs:{value:null}},link:{attrs:{href:null,type:null,hreflang:null,media:null,sizes:["all","16x16","16x16 32x32","16x16 32x32 64x64"]}},map:{attrs:{name:null}},mark:R,menu:{attrs:{label:null,type:["list","context","toolbar"]}},meta:{attrs:{content:null,charset:G,name:["viewport","application-name","author","description","generator","keywords"],"http-equiv":["content-language","content-type","default-style","refresh"]}},meter:{attrs:{value:null,min:null,low:null,high:null,max:null,optimum:null}},nav:R,noscript:R,object:{attrs:{data:null,type:null,name:null,usemap:null,form:null,width:null,height:null,typemustmatch:["typemustmatch"]}},ol:{attrs:{reversed:["reversed"],start:null,type:["1","a","A","i","I"]},children:["li","script","template","ul","ol"]},optgroup:{attrs:{disabled:["disabled"],label:null}},option:{attrs:{disabled:["disabled"],label:null,selected:["selected"],value:null}},output:{attrs:{for:null,form:null,name:null}},p:R,param:{attrs:{name:null,value:null}},pre:R,progress:{attrs:{value:null,max:null}},q:{attrs:{cite:null}},rp:R,rt:R,ruby:R,samp:R,script:{attrs:{type:["text/javascript"],src:null,async:["async"],defer:["defer"],charset:G}},section:R,select:{attrs:{form:null,name:null,size:null,autofocus:["autofocus"],disabled:["disabled"],multiple:["multiple"]}},slot:{attrs:{name:null}},small:R,source:{attrs:{src:null,type:null,media:null}},span:R,strong:R,style:{attrs:{type:["text/css"],media:null,scoped:null}},sub:R,summary:R,sup:R,table:R,tbody:R,td:{attrs:{colspan:null,rowspan:null,headers:null}},template:R,textarea:{attrs:{dirname:null,form:null,maxlength:null,name:null,placeholder:null,rows:null,cols:null,autofocus:["autofocus"],disabled:["disabled"],readonly:["readonly"],required:["required"],wrap:["soft","hard"]}},tfoot:R,th:{attrs:{colspan:null,rowspan:null,headers:null,scope:["row","col","rowgroup","colgroup"]}},thead:R,time:{attrs:{datetime:null}},title:R,tr:R,track:{attrs:{src:null,label:null,default:null,kind:["subtitles","captions","descriptions","chapters","metadata"],srclang:null}},ul:{children:["li","script","template","ul","ol"]},var:R,video:{attrs:{src:null,poster:null,width:null,height:null,crossorigin:["anonymous","use-credentials"],preload:["auto","metadata","none"],autoplay:["autoplay"],mediagroup:["movie"],muted:["muted"],controls:["controls"]}},wbr:R},H={accesskey:null,class:null,contenteditable:E,contextmenu:null,dir:["ltr","rtl","auto"],draggable:["true","false","auto"],dropzone:["copy","move","link","string:","file:"],hidden:["hidden"],id:null,inert:["inert"],itemid:null,itemprop:null,itemref:null,itemscope:["itemscope"],itemtype:null,lang:["ar","bn","de","en-GB","en-US","es","fr","hi","id","ja","pa","pt","ru","tr","zh"],spellcheck:E,autocorrect:E,autocapitalize:E,style:null,tabindex:null,title:null,translate:["yes","no"],rel:["stylesheet","alternate","author","bookmark","help","license","next","nofollow","noreferrer","prefetch","prev","search","tag"],role:"alert application article banner button cell checkbox complementary contentinfo dialog document feed figure form grid gridcell heading img list listbox listitem main navigation region row rowgroup search switch tab table tabpanel textbox timer".split(" "),"aria-activedescendant":null,"aria-atomic":E,"aria-autocomplete":["inline","list","both","none"],"aria-busy":E,"aria-checked":["true","false","mixed","undefined"],"aria-controls":null,"aria-describedby":null,"aria-disabled":E,"aria-dropeffect":null,"aria-expanded":["true","false","undefined"],"aria-flowto":null,"aria-grabbed":["true","false","undefined"],"aria-haspopup":E,"aria-hidden":E,"aria-invalid":["true","false","grammar","spelling"],"aria-label":null,"aria-labelledby":null,"aria-level":null,"aria-live":["off","polite","assertive"],"aria-multiline":E,"aria-multiselectable":E,"aria-owns":null,"aria-posinset":null,"aria-pressed":["true","false","mixed","undefined"],"aria-readonly":E,"aria-relevant":null,"aria-required":E,"aria-selected":["true","false","undefined"],"aria-setsize":null,"aria-sort":["ascending","descending","none","other"],"aria-valuemax":null,"aria-valuemin":null,"aria-valuenow":null,"aria-valuetext":null},J="beforeunload copy cut dragstart dragover dragleave dragenter dragend drag paste focus blur change click load mousedown mouseenter mouseleave mouseup keydown keyup resize scroll unload".split(" ").map(e=>"on"+e);for(let e of J)H[e]=null;class N{constructor(e,t){this.tags=Object.assign(Object.assign({},W),e),this.globalAttrs=Object.assign(Object.assign({},H),t),this.allTags=Object.keys(this.tags),this.globalAttrNames=Object.keys(this.globalAttrs)}}function I(e,t,a=e.length){if(!t)return"";let n=t.firstChild,l=n&&n.getChild("TagName");return l?e.sliceString(l.from,Math.min(l.to,a)):""}function U(e,t=!1){for(let a=e.parent;a;a=a.parent)if("Element"==a.name){if(!t)return a;t=!1}return null}function j(e,t,a){let n=a.tags[I(e,U(t,!0))];return(null==n?void 0:n.children)||a.allTags}function L(e,t){let a=[];for(let n=t;n=U(n);){let l=I(e,n);if(l&&"CloseTag"==n.lastChild.name)break;l&&0>a.indexOf(l)&&("EndTag"==t.name||t.from>=n.firstChild.to)&&a.push(l)}return a}N.default=new N;let z=/^[:\-\.\w\u00b7-\uffff]*$/;function F(e,t,a,n,l){let r=/\s*>/.test(e.sliceDoc(l,l+5))?"":">";return{from:n,to:l,options:j(e.doc,a,t).map(e=>({label:e,type:"type"})).concat(L(e.doc,a).map((e,t)=>({label:"/"+e,apply:"/"+e+r,type:"type",boost:99-t}))),validFor:/^\/?[:\-\.\w\u00b7-\uffff]*$/}}function K(e,t,a,n){let l=/\s*>/.test(e.sliceDoc(n,n+5))?"":">";return{from:a,to:n,options:L(e.doc,t).map((e,t)=>({label:e,apply:e+l,type:"type",boost:99-t})),validFor:z}}function ee(e,t){let{state:a,pos:n}=t,l=(0,M.qz)(a).resolveInner(n),r=l.resolve(n,-1);for(let e=n,t;l==r&&(t=r.childBefore(e));){let a=t.lastChild;if(!a||!a.type.isError||a.from<a.to)break;l=r=t,e=a.from}if("TagName"==r.name)return r.parent&&/CloseTag$/.test(r.parent.name)?K(a,r,r.from,n):F(a,e,r,r.from,n);if("StartTag"==r.name)return F(a,e,r,n,n);if("StartCloseTag"==r.name||"IncompleteCloseTag"==r.name)return K(a,r,n,n);if(t.explicit&&("OpenTag"==r.name||"SelfClosingTag"==r.name)||"AttributeName"==r.name){var s,o;let t,l,O;return s=r,o="AttributeName"==r.name?r.from:n,O=(l=(t=U(s))?e.tags[I(a.doc,t)]:null)&&l.attrs?Object.keys(l.attrs):[],{from:o,to:n,options:(l&&!1===l.globalAttrs?O:O.length?O.concat(e.globalAttrNames):e.globalAttrNames).map(e=>({label:e,type:"property"})),validFor:z}}return"Is"==r.name||"AttributeValue"==r.name||"UnquotedAttributeValue"==r.name?function(e,t,a,n,l){var r;let s=null===(r=a.parent)||void 0===r?void 0:r.getChild("AttributeName"),o=[],O;if(s){let r=e.sliceDoc(s.from,s.to),i=t.globalAttrs[r];if(!i){let n=U(a),l=n?t.tags[I(e.doc,n)]:null;i=(null==l?void 0:l.attrs)&&l.attrs[r]}if(i){let t=e.sliceDoc(n,l).toLowerCase(),a='"',r='"';for(let s of(/^['"]/.test(t)?(O='"'==t[0]?/^[^"]*$/:/^[^']*$/,a="",r=e.sliceDoc(l,l+1)==t[0]?"":t[0],t=t.slice(1),n++):O=/^[^\s<>='"]*$/,i))o.push({label:s,apply:a+s+r,type:"constant"})}}return{from:n,to:l,options:o,validFor:O}}(a,e,r,"Is"==r.name?n:r.from,n):t.explicit&&("Element"==l.name||"Text"==l.name||"Document"==l.name)?function(e,t,a,n){let l=[],r=0;for(let n of j(e.doc,a,t))l.push({label:"<"+n,type:"type"});for(let t of L(e.doc,a))l.push({label:"</"+t+">",type:"type",boost:99-r++});return{from:n,to:n,options:l,validFor:/^<\/?[:\-\.\w\u00b7-\uffff]*$/}}(a,e,r,n):null}function et(e){return ee(N.default,e)}function ea(e){let{extraTags:t,extraGlobalAttributes:a}=e,n=a||t?new N(t,a):N.default;return e=>ee(n,e)}let en=[{tag:"script",attrs:e=>"text/typescript"==e.type||"ts"==e.lang,parser:C.typescriptLanguage.parser},{tag:"script",attrs:e=>"text/babel"==e.type||"text/jsx"==e.type,parser:C.jsxLanguage.parser},{tag:"script",attrs:e=>"text/typescript-jsx"==e.type,parser:C.tsxLanguage.parser},{tag:"script",attrs:e=>!e.type||/^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^module$|^$/i.test(e.type),parser:C.javascriptLanguage.parser},{tag:"style",attrs:e=>(!e.lang||"css"==e.lang)&&(!e.type||/^(text\/)?(x-)?(stylesheet|css)$/i.test(e.type)),parser:A.cssLanguage.parser}],el=[{name:"style",parser:A.cssLanguage.parser.configure({top:"Styles"})}].concat(J.map(e=>({name:e,parser:C.javascriptLanguage.parser}))),er=M.qp.define({name:"html",parser:y.configure({props:[M.uj.add({Element(e){let t=/^(\s*)(<\/)?/.exec(e.textAfter);return e.node.to<=e.pos+t[0].length?e.continue():e.lineIndent(e.node.from)+(t[2]?0:e.unit)},"OpenTag CloseTag SelfClosingTag":e=>e.column(e.node.from)+e.unit,Document(e){if(e.pos+/\s*/.exec(e.textAfter)[0].length<e.node.to)return e.continue();let t=null,a;for(let a=e.node;;){let e=a.lastChild;if(!e||"Element"!=e.name||e.to!=a.to)break;t=a=e}return t&&!((a=t.lastChild)&&("CloseTag"==a.name||"SelfClosingTag"==a.name))?e.lineIndent(t.from)+e.unit:null}}),M.x0.add({Element(e){let t=e.firstChild,a=e.lastChild;return t&&"OpenTag"==t.name?{from:t.to,to:"CloseTag"==a.name?a.from:e.to}:null}}),M.a0.add({"OpenTag CloseTag":e=>e.getChild("TagName")})]}),languageData:{commentTokens:{block:{open:"<!--",close:"-->"}},indentOnInput:/^\s*<\/\w+\W$/,wordChars:"-._"}}),es=er.configure({wrap:X(en,el)});function eo(e={}){let t="",a;!1===e.matchClosingTags&&(t="noMatch"),!0===e.selfClosingTags&&(t=(t?t+" ":"")+"selfClosing"),(e.nestedLanguages&&e.nestedLanguages.length||e.nestedAttributes&&e.nestedAttributes.length)&&(a=X((e.nestedLanguages||[]).concat(en),(e.nestedAttributes||[]).concat(el)));let n=a?er.configure({wrap:a,dialect:t}):t?es.configure({dialect:t}):es;return new M.ri(n,[es.data.of({autocomplete:ea(e)}),!1!==e.autoCloseTags?ei:[],(0,C.javascript)().support,(0,A.css)().support])}let eO=new Set("area base br col command embed frame hr img input keygen link meta param source track wbr menuitem".split(" ")),ei=k.tk.inputHandler.of((e,t,a,n)=>{if(e.composing||e.state.readOnly||t!=a||">"!=n&&"/"!=n||!es.isActiveAt(e.state,t,-1))return!1;let{state:l}=e,r=l.changeByRange(t=>{var a,r,s;let{head:o}=t,O=(0,M.qz)(l).resolveInner(o,-1),i;if(("TagName"==O.name||"StartTag"==O.name)&&(O=O.parent),">"==n&&"OpenTag"==O.name){if((null===(r=null===(a=O.parent)||void 0===a?void 0:a.lastChild)||void 0===r?void 0:r.name)!="CloseTag"&&(i=I(l.doc,O.parent,o))&&!eO.has(i)){let t=">"===e.state.doc.sliceString(o,o+1),a=`${t?"":">"}</${i}>`;return{range:Y.jT.cursor(o+1),changes:{from:o+(t?1:0),insert:a}}}}else if("/"==n&&"OpenTag"==O.name){let t=O.parent,a=null==t?void 0:t.parent;if(t.from==o-1&&(null===(s=a.lastChild)||void 0===s?void 0:s.name)!="CloseTag"&&(i=I(l.doc,a,o))&&!eO.has(i)){let t=">"===e.state.doc.sliceString(o,o+1),a=`/${i}${t?"":">"}`,n=o+a.length+(t?1:0);return{range:Y.jT.cursor(n),changes:{from:o,insert:a}}}}return{range:t}});return!r.changes.empty&&(e.dispatch(r,{userEvent:"input.type",scrollIntoView:!0}),!0)})}}]);