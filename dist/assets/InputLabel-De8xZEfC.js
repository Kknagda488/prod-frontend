import{g as k,a as v,s as x,_ as l,r as h,u as C,e as L,z,A as F,j as f,i as g,d as q,k as I,at as $}from"./index-PDBVLXQN.js";function R(s){return v("MuiFormLabel",s)}const M=k("MuiFormLabel",["root","colorSecondary","focused","disabled","error","filled","required","asterisk"]),p=M,y=["children","className","color","component","disabled","error","filled","focused","required"],A=s=>{const{classes:r,color:e,focused:o,disabled:d,error:i,filled:n,required:u}=s,t={root:["root",`color${q(e)}`,d&&"disabled",i&&"error",n&&"filled",o&&"focused",u&&"required"],asterisk:["asterisk",i&&"error"]};return I(t,R,r)},N=x("label",{name:"MuiFormLabel",slot:"Root",overridesResolver:({ownerState:s},r)=>l({},r.root,s.color==="secondary"&&r.colorSecondary,s.filled&&r.filled)})(({theme:s,ownerState:r})=>l({color:(s.vars||s).palette.text.secondary},s.typography.body1,{lineHeight:"1.4375em",padding:0,position:"relative",[`&.${p.focused}`]:{color:(s.vars||s).palette[r.color].main},[`&.${p.disabled}`]:{color:(s.vars||s).palette.text.disabled},[`&.${p.error}`]:{color:(s.vars||s).palette.error.main}})),W=x("span",{name:"MuiFormLabel",slot:"Asterisk",overridesResolver:(s,r)=>r.asterisk})(({theme:s})=>({[`&.${p.error}`]:{color:(s.vars||s).palette.error.main}})),j=h.forwardRef(function(r,e){const o=C({props:r,name:"MuiFormLabel"}),{children:d,className:i,component:n="label"}=o,u=L(o,y),t=z(),a=F({props:o,muiFormControl:t,states:["color","required","focused","disabled","error","filled"]}),c=l({},o,{color:a.color||"primary",component:n,disabled:a.disabled,error:a.error,filled:a.filled,focused:a.focused,required:a.required}),m=A(c);return f.jsxs(N,l({as:n,ownerState:c,className:g(m.root,i),ref:e},u,{children:[d,a.required&&f.jsxs(W,{ownerState:c,"aria-hidden":!0,className:m.asterisk,children:[" ","*"]})]}))}),E=j;function U(s){return v("MuiInputLabel",s)}k("MuiInputLabel",["root","focused","disabled","error","required","asterisk","formControl","sizeSmall","shrink","animated","standard","filled","outlined"]);const P=["disableAnimation","margin","shrink","variant","className"],_=s=>{const{classes:r,formControl:e,size:o,shrink:d,disableAnimation:i,variant:n,required:u}=s,t={root:["root",e&&"formControl",!i&&"animated",d&&"shrink",o&&o!=="normal"&&`size${q(o)}`,n],asterisk:[u&&"asterisk"]},a=I(t,U,r);return l({},r,a)},O=x(E,{shouldForwardProp:s=>$(s)||s==="classes",name:"MuiInputLabel",slot:"Root",overridesResolver:(s,r)=>{const{ownerState:e}=s;return[{[`& .${p.asterisk}`]:r.asterisk},r.root,e.formControl&&r.formControl,e.size==="small"&&r.sizeSmall,e.shrink&&r.shrink,!e.disableAnimation&&r.animated,e.focused&&r.focused,r[e.variant]]}})(({theme:s,ownerState:r})=>l({display:"block",transformOrigin:"top left",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"100%"},r.formControl&&{position:"absolute",left:0,top:0,transform:"translate(0, 20px) scale(1)"},r.size==="small"&&{transform:"translate(0, 17px) scale(1)"},r.shrink&&{transform:"translate(0, -1.5px) scale(0.75)",transformOrigin:"top left",maxWidth:"133%"},!r.disableAnimation&&{transition:s.transitions.create(["color","transform","max-width"],{duration:s.transitions.duration.shorter,easing:s.transitions.easing.easeOut})},r.variant==="filled"&&l({zIndex:1,pointerEvents:"none",transform:"translate(12px, 16px) scale(1)",maxWidth:"calc(100% - 24px)"},r.size==="small"&&{transform:"translate(12px, 13px) scale(1)"},r.shrink&&l({userSelect:"none",pointerEvents:"auto",transform:"translate(12px, 7px) scale(0.75)",maxWidth:"calc(133% - 24px)"},r.size==="small"&&{transform:"translate(12px, 4px) scale(0.75)"})),r.variant==="outlined"&&l({zIndex:1,pointerEvents:"none",transform:"translate(14px, 16px) scale(1)",maxWidth:"calc(100% - 24px)"},r.size==="small"&&{transform:"translate(14px, 9px) scale(1)"},r.shrink&&{userSelect:"none",pointerEvents:"auto",maxWidth:"calc(133% - 32px)",transform:"translate(14px, -9px) scale(0.75)"}))),S=h.forwardRef(function(r,e){const o=C({name:"MuiInputLabel",props:r}),{disableAnimation:d=!1,shrink:i,className:n}=o,u=L(o,P),t=z();let a=i;typeof a>"u"&&t&&(a=t.filled||t.focused||t.adornedStart);const c=F({props:o,muiFormControl:t,states:["size","variant","required","focused"]}),m=l({},o,{disableAnimation:d,formControl:t,shrink:a,size:c.size,variant:c.variant,required:c.required,focused:c.focused}),b=_(m);return f.jsx(O,l({"data-shrink":a,ownerState:m,ref:e,className:g(b.root,n)},u,{classes:b}))}),H=S;export{H as I};
