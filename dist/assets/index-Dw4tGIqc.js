import*as i from"https://unpkg.com/three@0.155.0/build/three.module.js";import{OBJLoader as g}from"https://unpkg.com/three@0.155.0/examples/jsm/loaders/OBJLoader.js";import{MTLLoader as b}from"https://unpkg.com/three@0.155.0/examples/jsm/loaders/MTLLoader.js";import{OrbitControls as L}from"https://unpkg.com/three@0.155.0/examples/jsm/controls/OrbitControls.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))u(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&u(o)}).observe(document,{childList:!0,subtree:!0});function c(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function u(e){if(e.ep)return;e.ep=!0;const t=c(e);fetch(e.href,t)}})();const d=new i.Scene,l=new i.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1e3);l.position.z=10;const a=new i.WebGLRenderer;a.setSize(window.innerWidth,window.innerHeight);a.setClearColor(15044687);document.body.appendChild(a.domElement);const M=new i.AmbientLight(16777215,.5);d.add(M);const w=new i.DirectionalLight(16777215,1);w.position.set(10,10,10).normalize();d.add(w);const r=new L(l,a.domElement);r.enableDamping=!0;r.dampingFactor=.05;r.enableZoom=!0;r.minPolarAngle=0;r.maxPolarAngle=Math.PI;r.enablePan=!0;r.autoRotate=!0;r.autoRotateSpeed=2;function h(m){requestAnimationFrame(()=>h()),r.update(),a.render(d,l)}const y=(m,s,c)=>{new b().load(s,e=>{e.preload();const t=new g;t.setMaterials(e),t.load(m,o=>{o.scale.set(.8,.8,.8),o.rotation.x=-Math.PI/2;const n=new i.MeshStandardMaterial({color:16735232,metalness:.1,roughness:.5});o.traverse(f=>{f.isMesh&&(f.material=n)}),d.add(o),h()},void 0,o=>{console.error("Error loading the OBJ model with MTL:",o),console.log(`Trying fallback OBJ path: ${c}`),t.load(c,n=>{n.scale.set(.5,.5,.5),n.rotation.x=-Math.PI/2.8;const f=new i.MeshStandardMaterial({color:16765345,metalness:.2,roughness:.3});n.traverse(p=>{p.isMesh&&(p.material=f)}),d.add(n),h()},void 0,n=>{console.error("Error loading the fallback OBJ model:",n)})})},e=>{console.error("Error loading MTL file:",e)})},P="https://raw.githubusercontent.com/bytebrawnoffical/website/main/assets/component.obj",O="https://raw.githubusercontent.com/bytebrawnoffical/website/main/assets/component.mtl";y(P,O,"/website/assets/component.obj");window.addEventListener("resize",()=>{a.setSize(window.innerWidth,window.innerHeight),l.aspect=window.innerWidth/window.innerHeight,l.updateProjectionMatrix()});
