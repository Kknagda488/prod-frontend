import{r as u,j as e,a1 as A}from"./index-PDBVLXQN.js";import{v as f}from"./v4-D8aEg3BZ.js";function Q({allQuestion:x,updateAeessment:p,questionjson:G,setResult:m,setName:v,name:b}){const[a,n]=u.useState([]);u.useState([]);var h={id:f(),question:"",questionType:"",point:"",answers:[],correctAnswer:"",messageForCorrectAnswer:"",messageForIncorrectAnswer:"",explanation:""};u.useEffect(()=>{n(x)},[x]),console.log(a,"jkdj"),u.useState(),console.log(a,"oiuy");const j=l=>{const t=a.findIndex(c=>c.id===l);let s=[...a];if(t>=0){var d=s[t];d.answers.push("")}else console.warn(`Cannot remove : ${l}`);n(s)},g=(l,t)=>{const s=a.findIndex(r=>r.id===l),d=a[s].answers.findIndex(r=>r===t);let c=[...a];s>=0?c[s].answers.splice(d,1):console.warn(`Cannot remove : ${l}`),n(c)},N=l=>{var t;if(a.map(s=>(s.id===l&&(t=!0),s)),t){const s=a.findIndex(c=>c.id===l);let d=[...a];s>=0?(d[s],d.splice(s,1)):console.warn(`Cannot remove : ${l}`),n(d)}},i=()=>e.jsx("ul",{className:"flex flex-col w-full my-6",children:e.jsx("div",{className:"w-full lg:w-10/12 px-4 mx-auto mt-6",children:e.jsxs("div",{className:"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0",children:[e.jsx("div",{className:"rounded-t bg-white mb-0 px-6 py-6",children:p==="updateAeessment"?e.jsx("h6",{className:"text-gray-700 w-full text-xl font-bold",children:"Add Questions in Question Bank"}):e.jsxs("div",{className:"text-center flex justify-between space-x-4 items-center",children:[e.jsx("h6",{className:"text-blueGray-700 w-40 text-xl font-bold",children:"Template Name:"}),e.jsx("input",{type:"text",placeholder:"Set Template Title",className:"flex w-2/3 border-b-2 border-blue-500 outline-none",onMouseLeave:l=>v(l.target.value),defaultValue:b,required:!0}),e.jsx("button",{className:"bg-sky-500 text-white active:bg-sky-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150",onClick:()=>m(a),children:"Submit"})]})}),e.jsx("div",{className:"flex-auto px-4 lg:px-10 py-10 pt-0 bg-violet-200",children:e.jsxs("div",{children:[a==null?void 0:a.map((l,t)=>{var s,d,c;return e.jsxs("div",{className:"my-4 border-b-2 pb-2 border-sky-500",children:[e.jsxs("div",{className:"text-center flex justify-between items-center",children:[e.jsxs("h6",{className:"text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase",children:["Question #",t+1]}),e.jsxs("button",{className:"bg-sky-500 text-white active:bg-sky-600 h-fit font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150",type:"button",onClick:()=>N(l.id),children:["Remove Question #",t+1]})]}),e.jsxs("div",{className:"flex flex-wrap",children:[e.jsx("div",{className:"w-full lg:w-12/12 px-4",children:e.jsxs("div",{className:"relative w-full mb-3",children:[e.jsx("label",{className:"block uppercase text-blueGray-600 text-xs font-bold mb-2",children:"Question"}),e.jsx("input",{type:"text",className:"border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150",name:"question",defaultValue:l.question,onBlur:r=>l.question=r.target.value})]})}),e.jsx("div",{className:"w-full lg:w-1/2 px-4",children:e.jsxs("div",{className:"relative w-full mb-3",children:[e.jsx("label",{className:"block uppercase text-blueGray-600 text-xs font-bold mb-2",children:"Question Type"}),e.jsxs("select",{className:"border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150",required:"required",name:"questionType",defaultValue:l.type,onChange:r=>{l.questionType=r.target.value,l.questionType=="multiopt"?l.correctAnswer=[]:l.correctAnswer="",l.answers=["",""],n([...a])},children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select a Type"}),e.jsx("option",{value:"mcq",children:"Multiple Choice"}),e.jsx("option",{value:"fib",children:"Fill in the Blanks"}),e.jsx("option",{value:"tf",children:"True or False"}),e.jsx("option",{value:"multiopt",children:"Multi-Option"}),e.jsx("option",{value:"response",children:"Response"})]})]})}),e.jsx("div",{className:"w-full lg:w-1/2 px-4",children:e.jsxs("div",{className:"relative w-full mb-3",children:[e.jsx("label",{className:"block uppercase text-blueGray-600 text-xs font-bold mb-2",children:"Points"}),e.jsx("input",{type:"text",className:"border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150",name:"points",defaultValue:l.point,onBlur:r=>l.point=r.target.value,required:!0})]})})]}),e.jsx("h6",{className:"text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase",children:"Answer Information"}),(l==null?void 0:l.questionType)!=="response"?e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"bg-sky-500 text-white active:bg-sky-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150",type:"button",onClick:()=>j(l.id),children:"Add Option"}),e.jsxs("div",{className:"flex flex-wrap",children:[e.jsx("div",{className:"w-full flex flex-col lg:w-6/12 px-4",children:(s=l==null?void 0:l.answers)==null?void 0:s.map((r,o)=>e.jsxs("div",{className:"relative w-full mb-3",children:[e.jsxs("label",{className:"block uppercase text-blueGray-600 text-xs font-bold mb-2",children:["Option ",o+1]}),e.jsxs("div",{className:"flex",children:[e.jsx("input",{type:"text",required:!0,defaultValue:r,placeholder:`Option ${o+1}`,className:"border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150",onBlur:w=>l.answers[o]=w.target.value}),e.jsxs("button",{type:"button",title:"Remove Option",className:"flex items-center text-red-500 text-md",onClick:()=>g(l.id,r),children:[e.jsx(A,{className:"text-xl"})," #",o+1]})]})]},f()))}),e.jsx("div",{className:"w-full lg:w-6/12 px-4",children:e.jsxs("div",{className:"relative w-full mb-3",children:[e.jsx("label",{className:"block uppercase text-blueGray-600 text-xs font-bold mb-2",children:"Correct Option"}),l.questionType=="multiopt"?e.jsx("div",{className:"bg-white flex flex-col px-3 py-1 h-full",children:(d=l==null?void 0:l.answers)==null?void 0:d.map((r,o)=>{var w;return e.jsxs("div",{className:"form-check",children:[e.jsx("input",{checked:(w=l==null?void 0:l.correctAnswer)==null?void 0:w.find(y=>y===o+1),className:"h-4 w-4 text-blue-400 bg-white rounded bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer focus:outline-none transition duration-200 mt-1 align-top",type:"checkbox",value:`${o+1}`,onChange:y=>{const k=l.correctAnswer.indexOf(y.target.value);k>-1?l.correctAnswer.splice(k,1):l.correctAnswer.push(parseInt(y.target.value))},name:`option#${o+1}`,id:`option#${o+1}`}),e.jsx("label",{className:"form-check-label inline-block text-gray-700 font-semibold",children:`Option #${o+1}`})]},f())})}):e.jsxs("select",{className:"border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150",required:"required",name:"correctOption",onBlur:r=>l.correctAnswer=r.target.value,children:[e.jsx("option",{selected:!0,disabled:!0,hidden:!0,value:"",children:"Select Correct Option"}),(c=l==null?void 0:l.answers)==null?void 0:c.map((r,o)=>e.jsx("option",{selected:o+1==parseInt(l.correctAnswer)?"selected":null,value:`${o+1}`,children:`option #${o+1}`},f()))]})]})})]})]}):e.jsx("div",{className:"w-full lg:w-12/12 px-4",children:e.jsxs("div",{className:"relative w-full mb-3",children:[e.jsx("label",{className:"block uppercase text-blueGray-600 text-xs font-bold mb-2",children:"Correct Answer"}),e.jsx("input",{type:"text",className:"border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150",name:"correctOption",placeholder:"Enter correct answer",defaultValue:l.correctAnswer,onBlur:r=>l.correctAnswer=r.target.value})]})}),e.jsx("hr",{className:"mt-6 border-b-1 border-blueGray-300"})]},t)}),e.jsx("button",{className:"bg-sky-500 text-white active:bg-sky-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150",type:"button",onClick:()=>n([...a,h]),children:"Add Question"}),p==="updateAeessment"&&e.jsx("button",{className:"bg-sky-500 text-white active:bg-sky-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150",onClick:()=>m(a),children:"Submit"})]})})]})})});return e.jsx("div",{className:"flex flex-col",children:e.jsx(i,{})})}function F({allQuestion:x,updateAeessment:p,questionjson:G,setResult:m,setName:v,description:b,name:a}){const[n,h]=u.useState([]);u.useState([]);var j={id:f(),question:"",questionType:"",point:"",answers:b==null?void 0:b.data,correctAnswer:"",messageForCorrectAnswer:"",messageForIncorrectAnswer:"",explanation:""};u.useEffect(()=>{h(x)},[x]),console.log(n,"jkdj"),u.useState(),console.log(n,"oiuy");const g=i=>{var l;if(n.map(t=>(t.id===i&&(l=!0),t)),l){const t=n.findIndex(d=>d.id===i);let s=[...n];t>=0?(s[t],s.splice(t,1)):console.warn(`Cannot remove : ${i}`),h(s)}},N=()=>e.jsx("ul",{className:"flex flex-col w-full my-6",children:e.jsx("div",{className:"w-full lg:w-10/12 px-4 mx-auto mt-6",children:e.jsxs("div",{className:"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0",children:[e.jsx("div",{className:"rounded-t bg-white mb-0 px-6 py-6",children:p==="updateAeessment"?e.jsx("h6",{className:"text-gray-700 w-full text-xl font-bold",children:"Add Questions in Question Bank"}):e.jsxs("div",{className:"text-center flex justify-between space-x-4 items-center",children:[e.jsx("h6",{className:"text-blueGray-700 w-40 text-xl font-bold",children:"Template Name:"}),e.jsx("input",{type:"text",placeholder:"Set Template Title",className:"flex w-2/3 border-b-2 border-blue-500 outline-none",onMouseLeave:i=>v(i.target.value),defaultValue:a,required:!0}),e.jsx("button",{className:"bg-sky-500 text-white active:bg-sky-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150",onClick:()=>m(n),children:"Submit"})]})}),e.jsx("div",{className:"flex-auto px-4 lg:px-10 py-10 pt-0 bg-violet-200",children:e.jsxs("div",{children:[n==null?void 0:n.map((i,l)=>e.jsxs("div",{className:"my-4 border-b-2 pb-2 border-sky-500",children:[e.jsxs("div",{className:"text-center flex justify-between items-center",children:[e.jsxs("h6",{className:"text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase",children:["Question #",l+1]}),e.jsxs("button",{className:"bg-sky-500 text-white active:bg-sky-600 h-fit font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150",type:"button",onClick:()=>g(i.id),children:["Remove Question #",l+1]})]}),e.jsxs("div",{className:"flex flex-wrap",children:[e.jsx("div",{className:"w-full lg:w-12/12 px-4",children:e.jsxs("div",{className:"relative w-full mb-3",children:[e.jsx("label",{className:"block uppercase text-blueGray-600 text-xs font-bold mb-2",children:"Question"}),e.jsx("input",{type:"text",className:"border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150",name:"question",defaultValue:i.question,onBlur:t=>i.question=t.target.value})]})}),e.jsx("div",{className:"w-full lg:w-1/2 px-4",children:e.jsxs("div",{className:"relative w-full mb-3",children:[e.jsx("label",{className:"block uppercase text-blueGray-600 text-xs font-bold mb-2",children:"Question Type"}),e.jsxs("select",{className:"border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150",required:"required",name:"questionType",defaultValue:i.type,onBlur:t=>i.questionType=t.target.value,children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select Type"}),e.jsx("option",{value:"ratings",children:"Rating"}),e.jsx("option",{value:"response",children:"Personal Response"})]})]})})]}),e.jsx("hr",{className:"mt-6 border-b-1 border-blueGray-300"})]},l)),e.jsx("button",{className:"bg-sky-500 text-white active:bg-sky-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150",type:"button",onClick:()=>h([...n,j]),children:"Add Question"}),p==="updateAeessment"&&e.jsx("button",{className:"bg-sky-500 text-white active:bg-sky-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150",onClick:()=>m(n),children:"Submit"})]})})]})})});return e.jsx("div",{className:"flex flex-col",children:e.jsx(N,{})})}export{Q as C,F as a};
