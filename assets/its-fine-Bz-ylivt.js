import{r as n}from"./react-jpDy1dhu.js";var b=Object.defineProperty,y=Object.defineProperties,w=Object.getOwnPropertyDescriptors,u=Object.getOwnPropertySymbols,P=Object.prototype.hasOwnProperty,h=Object.prototype.propertyIsEnumerable,c=(e,t,r)=>t in e?b(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,l=(e,t)=>{for(var r in t||(t={}))P.call(t,r)&&c(e,r,t[r]);if(u)for(var r of u(t))h.call(t,r)&&c(e,r,t[r]);return e},x=(e,t)=>y(e,w(t)),p,d;typeof window<"u"&&((p=window.document)!=null&&p.createElement||((d=window.navigator)==null?void 0:d.product)==="ReactNative")?n.useLayoutEffect:n.useEffect;function m(e,t,r){if(!e)return;if(r(e)===!0)return e;let i=e.child;for(;i;){const o=m(i,t,r);if(o)return o;i=i.sibling}}function v(e){try{return Object.defineProperties(e,{_currentRenderer:{get(){return null},set(){}},_currentRenderer2:{get(){return null},set(){}}})}catch{return e}}const f=console.error;console.error=function(){const e=[...arguments].join("");if(e!=null&&e.startsWith("Warning:")&&e.includes("useContext")){console.error=f;return}return f.apply(this,arguments)};const a=v(n.createContext(null));class g extends n.Component{render(){return n.createElement(a.Provider,{value:this._reactInternals},this.props.children)}}function O(){const e=n.useContext(a);if(e===null)throw new Error("its-fine: useFiber must be called within a <FiberProvider />!");const t=n.useId();return n.useMemo(()=>{for(const i of[e,e==null?void 0:e.alternate]){if(!i)continue;const o=m(i,!1,_=>{let s=_.memoizedState;for(;s;){if(s.memoizedState===t)return!0;s=s.next}});if(o)return o}},[e,t])}function C(){const e=O(),[t]=n.useState(()=>new Map);t.clear();let r=e;for(;r;){if(r.type&&typeof r.type=="object"){const o=r.type._context===void 0&&r.type.Provider===r.type?r.type:r.type._context;o&&o!==a&&!t.has(o)&&t.set(o,n.useContext(v(o)))}r=r.return}return t}function F(){const e=C();return n.useMemo(()=>Array.from(e.keys()).reduce((t,r)=>i=>n.createElement(t,null,n.createElement(r.Provider,x(l({},i),{value:e.get(r)}))),t=>n.createElement(g,l({},t))),[e])}export{g as F,F as u};
