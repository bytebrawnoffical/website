import*as s from"https://unpkg.com/three@0.155.0/build/three.module.js";import{OBJLoader as p}from"https://unpkg.com/three@0.155.0/examples/jsm/loaders/OBJLoader.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function i(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(e){if(e.ep)return;e.ep=!0;const o=i(e);fetch(e.href,o)}})();const a=new s.Scene,d=new s.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1e3);d.position.z=10;const l=new s.WebGLRenderer;l.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(l.domElement);const w=new s.AmbientLight(16777215,.5);a.add(w);const m=(t,n)=>{const i=new s.MeshPhongMaterial({color:n});t.traverse(r=>{r.isMesh&&(r.material=i)})};function f(t){requestAnimationFrame(()=>f(t)),t.rotation.y+=.01,t.rotation.x+=.01,t.rotation.z+=.01,l.render(a,d)}const u=(t,n)=>{const i=new p;i.load(t,r=>{r.scale.set(.8,.8,.8),m(r,15422516),a.add(r),f(r)},void 0,r=>{console.error("Error loading the OBJ model from primary path:",r),n&&(console.log(`Trying fallback path: ${n}`),i.load(n,e=>{e.scale.set(.5,.5,.5),m(e,15584443),a.add(e),f(e)},void 0,e=>{console.error("Error loading the OBJ model from fallback path:",e)}))})},h="https://raw.githubusercontent.com/bytebrawnoffical/website/main/assets/logo.obj";u(h,"/website/assets/logo.obj");u("/website/assets/logo.obj","/assets/logo.obj");window.addEventListener("resize",()=>{l.setSize(window.innerWidth,window.innerHeight),d.aspect=window.innerWidth/window.innerHeight,d.updateProjectionMatrix()});
