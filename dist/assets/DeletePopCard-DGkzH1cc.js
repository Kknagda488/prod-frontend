import{g as f,a as D,r as d,s as u,ah as q,ai as G,d as g,_ as i,aj as A,u as b,l as Q,e as C,ak as Z,j as a,i as x,k as v,al as oo,T as N,J as B}from"./index-PDBVLXQN.js";function eo(o){return D("MuiDialog",o)}const to=f("MuiDialog",["root","scrollPaper","scrollBody","container","paper","paperScrollPaper","paperScrollBody","paperWidthFalse","paperWidthXs","paperWidthSm","paperWidthMd","paperWidthLg","paperWidthXl","paperFullWidth","paperFullScreen"]),S=to,so=d.createContext({}),U=so,ao=["aria-describedby","aria-labelledby","BackdropComponent","BackdropProps","children","className","disableEscapeKeyDown","fullScreen","fullWidth","maxWidth","onBackdropClick","onClose","open","PaperComponent","PaperProps","scroll","TransitionComponent","transitionDuration","TransitionProps"],io=u(q,{name:"MuiDialog",slot:"Backdrop",overrides:(o,e)=>e.backdrop})({zIndex:-1}),ro=o=>{const{classes:e,scroll:t,maxWidth:s,fullWidth:n,fullScreen:r}=o,c={root:["root"],container:["container",`scroll${g(t)}`],paper:["paper",`paperScroll${g(t)}`,`paperWidth${g(String(s))}`,n&&"paperFullWidth",r&&"paperFullScreen"]};return v(c,eo,e)},no=u(G,{name:"MuiDialog",slot:"Root",overridesResolver:(o,e)=>e.root})({"@media print":{position:"absolute !important"}}),lo=u("div",{name:"MuiDialog",slot:"Container",overridesResolver:(o,e)=>{const{ownerState:t}=o;return[e.container,e[`scroll${g(t.scroll)}`]]}})(({ownerState:o})=>i({height:"100%","@media print":{height:"auto"},outline:0},o.scroll==="paper"&&{display:"flex",justifyContent:"center",alignItems:"center"},o.scroll==="body"&&{overflowY:"auto",overflowX:"hidden",textAlign:"center","&::after":{content:'""',display:"inline-block",verticalAlign:"middle",height:"100%",width:"0"}})),co=u(A,{name:"MuiDialog",slot:"Paper",overridesResolver:(o,e)=>{const{ownerState:t}=o;return[e.paper,e[`scrollPaper${g(t.scroll)}`],e[`paperWidth${g(String(t.maxWidth))}`],t.fullWidth&&e.paperFullWidth,t.fullScreen&&e.paperFullScreen]}})(({theme:o,ownerState:e})=>i({margin:32,position:"relative",overflowY:"auto","@media print":{overflowY:"visible",boxShadow:"none"}},e.scroll==="paper"&&{display:"flex",flexDirection:"column",maxHeight:"calc(100% - 64px)"},e.scroll==="body"&&{display:"inline-block",verticalAlign:"middle",textAlign:"left"},!e.maxWidth&&{maxWidth:"calc(100% - 64px)"},e.maxWidth==="xs"&&{maxWidth:o.breakpoints.unit==="px"?Math.max(o.breakpoints.values.xs,444):`max(${o.breakpoints.values.xs}${o.breakpoints.unit}, 444px)`,[`&.${S.paperScrollBody}`]:{[o.breakpoints.down(Math.max(o.breakpoints.values.xs,444)+32*2)]:{maxWidth:"calc(100% - 64px)"}}},e.maxWidth&&e.maxWidth!=="xs"&&{maxWidth:`${o.breakpoints.values[e.maxWidth]}${o.breakpoints.unit}`,[`&.${S.paperScrollBody}`]:{[o.breakpoints.down(o.breakpoints.values[e.maxWidth]+32*2)]:{maxWidth:"calc(100% - 64px)"}}},e.fullWidth&&{width:"calc(100% - 64px)"},e.fullScreen&&{margin:0,width:"100%",maxWidth:"100%",height:"100%",maxHeight:"none",borderRadius:0,[`&.${S.paperScrollBody}`]:{margin:0,maxWidth:"100%"}})),po=d.forwardRef(function(e,t){const s=b({props:e,name:"MuiDialog"}),n=Q(),r={enter:n.transitions.duration.enteringScreen,exit:n.transitions.duration.leavingScreen},{"aria-describedby":c,"aria-labelledby":l,BackdropComponent:p,BackdropProps:k,children:F,className:_,disableEscapeKeyDown:T=!1,fullScreen:I=!1,fullWidth:L=!1,maxWidth:E="sm",onBackdropClick:P,onClose:y,open:j,PaperComponent:Y=A,PaperProps:R={},scroll:X="paper",TransitionComponent:z=oo,transitionDuration:w=r,TransitionProps:H}=s,K=C(s,ao),h=i({},s,{disableEscapeKeyDown:T,fullScreen:I,fullWidth:L,maxWidth:E,scroll:X}),W=ro(h),$=d.useRef(),J=m=>{$.current=m.target===m.currentTarget},O=m=>{$.current&&($.current=null,P&&P(m),y&&y(m,"backdropClick"))},M=Z(l),V=d.useMemo(()=>({titleId:M}),[M]);return a.jsx(no,i({className:x(W.root,_),closeAfterTransition:!0,components:{Backdrop:io},componentsProps:{backdrop:i({transitionDuration:w,as:p},k)},disableEscapeKeyDown:T,onClose:y,open:j,ref:t,onClick:O,ownerState:h},K,{children:a.jsx(z,i({appear:!0,in:j,timeout:w,role:"presentation"},H,{children:a.jsx(lo,{className:x(W.container),onMouseDown:J,ownerState:h,children:a.jsx(co,i({as:Y,elevation:24,role:"dialog","aria-describedby":c,"aria-labelledby":M},R,{className:x(W.paper,R.className),ownerState:h,children:a.jsx(U.Provider,{value:V,children:F})}))})}))}))}),uo=po;function go(o){return D("MuiDialogActions",o)}f("MuiDialogActions",["root","spacing"]);const xo=["className","disableSpacing"],mo=o=>{const{classes:e,disableSpacing:t}=o;return v({root:["root",!t&&"spacing"]},go,e)},ho=u("div",{name:"MuiDialogActions",slot:"Root",overridesResolver:(o,e)=>{const{ownerState:t}=o;return[e.root,!t.disableSpacing&&e.spacing]}})(({ownerState:o})=>i({display:"flex",alignItems:"center",padding:8,justifyContent:"flex-end",flex:"0 0 auto"},!o.disableSpacing&&{"& > :not(style) ~ :not(style)":{marginLeft:8}})),fo=d.forwardRef(function(e,t){const s=b({props:e,name:"MuiDialogActions"}),{className:n,disableSpacing:r=!1}=s,c=C(s,xo),l=i({},s,{disableSpacing:r}),p=mo(l);return a.jsx(ho,i({className:x(p.root,n),ownerState:l,ref:t},c))}),Do=fo;function bo(o){return D("MuiDialogContent",o)}f("MuiDialogContent",["root","dividers"]);function Co(o){return D("MuiDialogTitle",o)}const vo=f("MuiDialogTitle",["root"]),ko=vo,yo=["className","dividers"],Wo=o=>{const{classes:e,dividers:t}=o;return v({root:["root",t&&"dividers"]},bo,e)},$o=u("div",{name:"MuiDialogContent",slot:"Root",overridesResolver:(o,e)=>{const{ownerState:t}=o;return[e.root,t.dividers&&e.dividers]}})(({theme:o,ownerState:e})=>i({flex:"1 1 auto",WebkitOverflowScrolling:"touch",overflowY:"auto",padding:"20px 24px"},e.dividers?{padding:"16px 24px",borderTop:`1px solid ${(o.vars||o).palette.divider}`,borderBottom:`1px solid ${(o.vars||o).palette.divider}`}:{[`.${ko.root} + &`]:{paddingTop:0}})),Mo=d.forwardRef(function(e,t){const s=b({props:e,name:"MuiDialogContent"}),{className:n,dividers:r=!1}=s,c=C(s,yo),l=i({},s,{dividers:r}),p=Wo(l);return a.jsx($o,i({className:x(p.root,n),ownerState:l,ref:t},c))}),So=Mo,To=["className","id"],Po=o=>{const{classes:e}=o;return v({root:["root"]},Co,e)},jo=u(N,{name:"MuiDialogTitle",slot:"Root",overridesResolver:(o,e)=>e.root})({padding:"16px 24px",flex:"0 0 auto"}),Ro=d.forwardRef(function(e,t){const s=b({props:e,name:"MuiDialogTitle"}),{className:n,id:r}=s,c=C(s,To),l=s,p=Po(l),{titleId:k=r}=d.useContext(U);return a.jsx(jo,i({component:"h2",className:x(p.root,n),ownerState:l,ref:t,variant:"h6",id:r??k},c))}),wo=Ro,Ao=({title:o,cancelDelete:e,confirmDelete:t})=>a.jsxs(uo,{open:!0,onClose:e,children:[a.jsx(wo,{children:o}),a.jsx(So,{children:a.jsx(N,{variant:"body1",children:"Are you sure you want to delete this item?"})}),a.jsxs(Do,{children:[a.jsx(B,{onClick:e,color:"primary",children:"Cancel"}),a.jsx(B,{onClick:t,color:"secondary",children:"Delete"})]})]});export{Ao as D};