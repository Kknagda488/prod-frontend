import{a0 as te,m as se,p as re,r,j as e,q as y,Q as i}from"./index-PDBVLXQN.js";import{C as le}from"./index.esm-3mRNvFvF.js";import{S as V}from"./react-select.esm-QO7Mfydt.js";import{R as oe}from"./RichTextEditor-DxNNB7hl.js";import"./index-ucbQh0HC.js";const he=()=>{const{id:b}=te();console.log("--------------id",b);const $=se(),{userData:o,signOut:x}=re(),[m,ne]=r.useState(b),[j,F]=r.useState([]),[q,_]=r.useState(null),[N,v]=r.useState("1"),[w,S]=r.useState("");function Y(a){v(a.target.value)}function M(a){S(a.target.value)}const[de,L]=r.useState(null),[g,T]=r.useState([]),[d,P]=r.useState(null),[f,k]=r.useState([]),[ie,A]=r.useState(""),[t,C]=r.useState({}),[n,p]=r.useState(null),[ce,D]=r.useState(null),[ue,U]=r.useState([]);r.useState(!1),r.useState(!1),r.useState([]);const[R,E]=r.useState(""),[h,O]=r.useState(""),B=a=>{O(a)},z=a=>{const s=a.target.files[0];if(s){const l=s.name;A(l),H(s)}},H=async a=>{try{const s=new FormData;s.append("file",a);const l=await fetch(`http://15.206.237.179:8000/api/programOutlines/updateFile/${n?n.data:null}?access_token=${o==null?void 0:o.accessToken}`,{method:"PUT",body:s}),u=await l.json();l.ok?(i.success("File uploaded successfully."),F([a.name]),_(u.data.id),console.log("File updated successfully.")):(console.error("Failed to updated file."),i.error("File updated successfully."))}catch(s){console.error("Error updated file:",s),i.error("File updated Faild.")}},I={container:a=>({...a,flex:1}),control:a=>({...a,border:"1px solid rgb(209 213 219)",boxShadow:"none","&:hover":{border:"1px solid rgb(17 24 39)"}}),input:a=>({...a,color:"rgb(75 85 99)",paddingLeft:"6px",paddingBottom:"3px",fontSize:"1rem",lineHeight:"1.25rem"}),placeholder:a=>({...a,color:"#a1a9bb",paddingLeft:"6px",fontSize:"0.870rem",lineHeight:"1.25rem"})},Q=()=>{fetch(`http://15.206.237.179:8000/api/clients/listofclient?filter=%7B%22search%22%3A%22%22%7D&access_token=${o==null?void 0:o.accessToken}`).then(async a=>{const s=await a.json();if(!a.ok){const l=s&&s.message||a.statusText;return Promise.reject(l)}T(s.data)}).catch(a=>{T([]),console.error("There was an error!",a),a==="Token Expired"&&x()})},G=a=>{P(a),p(null),D(null),U([])},J=()=>{fetch(`http://15.206.237.179:8000/api/projects/listofProgramName?id=${d.data}&filter=%7B%22search%22%3A%22%22%7D&access_token=${o==null?void 0:o.accessToken}`).then(async a=>{const s=await a.json();if(!a.ok){const l=s&&s.message||a.statusText;return Promise.reject(l)}k(s.data)}).catch(a=>{k([]),console.error("There was an error!",a),a==="Token Expired"&&x()})},K=a=>{p(a),D(a.data)};r.useEffect(()=>{Q()},[]),r.useEffect(()=>{d&&J()},[d]);const W=g==null?void 0:g.map(a=>({data:a==null?void 0:a.client_id,label:a==null?void 0:a.client_name})),X=f==null?void 0:f.map(a=>({data:a==null?void 0:a.project_id,label:`${a==null?void 0:a.project_title} ~ ProgramId: ${a==null?void 0:a.project_id} ~ ${a!=null&&a.location_of_training?a==null?void 0:a.location_of_training:"No location allocate"} `})),Z=a=>{a.preventDefault();var s={};Array.from(a.currentTarget.elements).forEach(l=>{l.name&&(s[l.name]=l.value)}),h&&(s.objectives=h),ee(s)},ee=async a=>{var l;try{var s;let u=new URLSearchParams(Object.entries(a)).toString();s=await fetch(`http://15.206.237.179:8000/api/programs/edit/${m}?access_token=${o==null?void 0:o.accessToken}`,{headers:{"Content-Type":"application/x-www-form-urlencoded"},method:"POST",body:u});const c=await s.json();s.ok?c.code===404?i.error(c.msg):c.status==="failure"?i.error(c.msg):(i.success("Program updated successfully!!"),$("/program")):i.error((l=c==null?void 0:c.error)==null?void 0:l.message)}catch(u){i.error(u.message)}},ae=()=>{fetch(`http://15.206.237.179:8000/api/programs/getProgramById/${m}?access_token=${o==null?void 0:o.accessToken}`).then(async a=>{const s=await a.json();if(!a.ok){const l=s&&s.message||a.statusText;throw new Error(l)}console.log(s.data),C(s.data),s.data.objectives&&O(s.data.objectives),E(s.data.color)}).catch(a=>{C({}),console.error("There was an error!",a),(a==="Token Expired"||a==="Malformed User")&&x()})};return r.useEffect(()=>{m&&ae()},[m]),r.useEffect(()=>{t&&(t.intervalDays&&L(()=>t.intervalDays.split(",").map(a=>({label:a,value:a}))),t.clientId&&P({label:t.clientName,data:t.clientId}),t.programId&&p({label:t.programName+" ~ ProgramId: "+t.programId+" ~ "+t.location,data:t.programId}),v(t.trainingType),S(t.programType))},[t]),console.log(n,"program"),e.jsx("div",{children:e.jsx("div",{className:"flex mt-5 flex-col w-full justify-center  ",children:e.jsx("div",{className:"relative py-5 w-full  px-1 ",children:e.jsx("div",{className:"relative px-4 py-2  rounded-md  bg-white ",children:e.jsxs("div",{className:"w-full mx-auto",children:[e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx("div",{className:"h-10 w-10 bg-sky-500 rounded-full flex flex-shrink-0 justify-center items-center text-white text-2xl font-semibold",children:e.jsx(le,{})}),e.jsxs("div",{className:"block pl-2 font-semibold text-xl self-start text-gray-700",children:[e.jsx("h2",{className:"leading-relaxed",children:"Update Program"}),e.jsx("p",{className:"text-gray-500 font-normal leading-relaxed text-lg",children:"Enter the program details."})]})]}),e.jsxs("form",{onSubmit:Z,className:"divide-y divide-gray-200",children:[e.jsx("div",{className:"flex flex-col w-full justify-between py-8 text-base leading-6 space-x-4 text-gray-700 sm:text-lg sm:leading-7",children:e.jsxs("div",{className:"flex flex-col w-full space-y-1",children:[e.jsxs("div",{className:"flex flex-wrap",children:[e.jsxs("div",{className:"w-1/2 px-2",children:[e.jsx("label",{className:"leading-loose",children:"Client Name"}),e.jsx("div",{className:"relative focus-within:text-gray-600 text-gray-400",children:e.jsx(V,{options:W,onChange:G,value:d,styles:I,placeholder:"Select Client",getOptionValue:a=>a.data})}),e.jsx("input",{type:"text",name:"clientName",className:"hidden px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600",placeholder:"Client Name",required:!0,defaultValue:d==null?void 0:d.label}),e.jsx("input",{type:"text",name:"clientId",className:"hidden px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600",placeholder:"Client Name",required:!0,defaultValue:d==null?void 0:d.data})]}),e.jsxs("div",{className:"w-1/2 px-2",children:[e.jsxs("div",{className:"flex justify-between w-full items-center",children:[e.jsx("label",{className:"leading-loose",children:"Program Name"}),e.jsxs("label",{className:"leading-loose",children:["Program Id:",n?n.data:null]})]}),e.jsx("div",{className:"relative focus-within:text-gray-600 text-gray-400",children:e.jsx(V,{options:X,onChange:K,value:n,styles:I,placeholder:"Select Program",getOptionValue:a=>a.data})}),e.jsx("input",{type:"text",name:"programName",className:"hidden px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600",placeholder:"Program Name",defaultValue:n==null?void 0:n.label}),e.jsx("input",{type:"text",name:"programId",className:"hidden px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600",placeholder:"Program Id",defaultValue:n==null?void 0:n.data})]})]}),e.jsx("div",{className:"flex flex-wrap",children:e.jsxs("div",{className:"w-1/2 px-2",children:[e.jsx("label",{className:"leading-loose",children:"Program Type"}),e.jsxs("select",{name:"programType",required:!0,onChange:M,value:w,defaultValue:t==null?void 0:t.programType,className:"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",children:[e.jsx("option",{value:"",children:"Select program type"}),e.jsx("option",{value:"1",children:"Open"}),e.jsx("option",{value:"0",children:"Close"})]})]})}),e.jsxs("div",{className:"flex flex-wrap",children:[e.jsxs("div",{className:"w-1/2 px-2",children:[e.jsx("label",{className:"leading-loose",children:"Program Start Date"}),e.jsx("input",{type:"date",name:"programStartDate",required:!0,className:"px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600",placeholder:"Program Start Date",defaultValue:t!=null&&t.programStartDate?y(t==null?void 0:t.programStartDate).format("YYYY-MM-DD"):""})]}),e.jsxs("div",{className:"w-1/2 px-2",children:[e.jsx("label",{className:"leading-loose",children:"Program Start Time"}),e.jsx("input",{type:"time",name:"programStartTime",required:!0,className:"px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600",placeholder:"Program Start Time",defaultValue:t==null?void 0:t.programStartTime})]}),e.jsxs("div",{className:"w-1/2 px-2",children:[e.jsx("label",{className:"leading-loose",children:"Program End Date"}),e.jsx("input",{type:"date",name:"programEndDate",className:"px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600",placeholder:"Program End Date",required:!0,defaultValue:t!=null&&t.programEndDate?y(t==null?void 0:t.programEndDate).format("YYYY-MM-DD"):""})]}),e.jsxs("div",{className:"w-1/2 px-2",children:[e.jsx("label",{className:"leading-loose",children:"Program End Time"}),e.jsx("input",{type:"time",name:"programEndTime",required:!0,className:"px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600",placeholder:"Program End Date",defaultValue:t==null?void 0:t.programEndTime})]}),w=="1"?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"w-1/2 px-2",children:[e.jsx("label",{className:"leading-loose",children:"Nomination End Date*"}),e.jsx("input",{type:"date",name:"nominationDate",className:"px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600",placeholder:"Program Date",required:!0,defaultValue:t.nominationDate?y(t.nominationDate).format("YYYY-MM-DD"):""})]}),e.jsxs("div",{className:"w-1/2 px-2",children:[e.jsx("label",{className:"leading-loose",children:"Nomination End Time*"}),e.jsx("input",{type:"time",name:"nominationTime",required:!0,className:"px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600",placeholder:"Program Time",defaultValue:t.nominationTime})]}),e.jsxs("div",{className:"w-1/2 px-2",children:[e.jsx("label",{className:"leading-loose",children:"Nomination Limit*"}),e.jsx("input",{type:"number",name:"nominationLimit",className:"px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600",placeholder:"Program nomination limit",defaultValue:t.nominationLimit,required:!0})]}),e.jsxs("div",{className:"w-1/2 px-2",children:[e.jsx("label",{className:"leading-loose",children:"Program Outline"}),e.jsxs("select",{name:"programOutline",defaultValue:t.programOutline,value:q,className:"px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600",children:[e.jsx("option",{value:"",children:t.programOutline}),j&&j.map((a,s)=>e.jsx("option",{value:a,children:a}))]})]}),e.jsxs("div",{className:"w-1/2 px-2",children:[e.jsx("label",{className:"leading-loose",children:"Files"}),e.jsx("input",{type:"file",name:"files",className:"px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600",placeholder:"choose file",onChange:z})]})]}):null,e.jsxs("div",{className:"w-1/2 px-2",children:[e.jsx("label",{className:"leading-loose",children:"Training Mode"}),e.jsxs("select",{name:"trainingType",className:"px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600",value:N,required:!0,onChange:Y,defaultValue:t==null?void 0:t.trainingType,children:[e.jsx("option",{value:"1",children:"Class Room Training"}),e.jsx("option",{value:"2",children:"Virtual Training"})]})]}),N=="1"?e.jsxs("div",{className:"w-1/2 px-2",children:[e.jsx("label",{className:"leading-loose",children:"Location"}),e.jsx("input",{type:"text",name:"location",className:"px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600",placeholder:"City",defaultValue:t==null?void 0:t.location})]}):null,e.jsxs("div",{className:"w-1/2 px-2",children:[e.jsx("label",{className:"leading-loose",children:"Program Color"}),e.jsx("input",{type:"color",name:"color",className:"block w-full",placeholder:"Program Color",required:!0,onChange:a=>{E(a.target.value)},value:R})]}),e.jsxs("div",{className:"w-1/2 px-2",children:[e.jsx("label",{className:"leading-loose",children:"Status"}),e.jsxs("select",{placeholder:"Select status",name:"status",required:!0,className:"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",children:[e.jsx("option",{value:"1",selected:(t==null?void 0:t.status)==1,children:"Active"}),e.jsx("option",{value:"0",selected:(t==null?void 0:t.status)==0,children:"In Active"})]})]})," ",e.jsxs("div",{className:"w-1/2 px-2",children:[e.jsx("label",{className:"leading-loose",children:"Objectives"}),e.jsx(oe,{value:h,onChange:B})]})]})]})}),e.jsx("div",{className:"py-4  space-x-4",children:e.jsx("button",{type:"submit",className:"bg-sky-500 flex-inline justify-center items-center text-white px-4 py-2 rounded-md focus:outline-none",children:"Save"})})]})]})})})})})};export{he as default};
