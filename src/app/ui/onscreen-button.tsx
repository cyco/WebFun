import { Component } from "src/ui";
import "./onscreen-button.scss";

const BackgroundSVG = `<?xml version="1.0" encoding="UTF-8" standalone="no"?> <svg    xmlns:dc="http://purl.org/dc/elements/1.1/"    xmlns:cc="http://creativecommons.org/ns#"    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"    xmlns:svg="http://www.w3.org/2000/svg"    xmlns="http://www.w3.org/2000/svg"    xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"    xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"    version="1.1"    id="svg1216"    sodipodi:docname="btn.svg"    inkscape:version="1.0beta2 (2b71d25, 2019-12-03)"    width="80"    height="80" viewBox="0 0 80 80">   <metadata      id="metadata1220">     <rdf:RDF>       <cc:Work          rdf:about="">         <dc:format>image/svg+xml</dc:format>         <dc:type            rdf:resource="http://purl.org/dc/dcmitype/StillImage" />         <dc:title></dc:title>       </cc:Work>     </rdf:RDF>   </metadata>   <sodipodi:namedview      pagecolor="#ffffff"      bordercolor="#666666"      inkscape:document-rotation="0"      borderopacity="1"      objecttolerance="10"      gridtolerance="10"      guidetolerance="10"      inkscape:pageopacity="0"      inkscape:pageshadow="2"      inkscape:window-width="1440"      inkscape:window-height="554"      id="namedview1218"      showgrid="false"      inkscape:zoom="1.43"      inkscape:cx="277.11699"      inkscape:cy="78.125875"      inkscape:window-x="67"      inkscape:window-y="23"      inkscape:window-maximized="0"      inkscape:current-layer="shoot" />   <defs      id="defs986">     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.02929688,0.02929688,0,44,484)"        id="gradient0">       <stop          offset="0"          stop-color="#383838"          id="stop721" />       <stop          offset="1"          stop-color="#585858"          id="stop723" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.02929688,0.02929688,0,104,484)"        id="gradient1">       <stop          offset="0"          stop-color="#383838"          id="stop726" />       <stop          offset="1"          stop-color="#585858"          id="stop728" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.02929688,0.02929688,0,164,484)"        id="gradient2">       <stop          offset="0"          stop-color="#383838"          id="stop731" />       <stop          offset="1"          stop-color="#585858"          id="stop733" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.02929688,0.02929688,0,224,484)"        id="gradient3">       <stop          offset="0"          stop-color="#383838"          id="stop736" />       <stop          offset="1"          stop-color="#585858"          id="stop738" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.02929688,0.02929688,0,284,484)"        id="gradient4">       <stop          offset="0"          stop-color="#383838"          id="stop741" />       <stop          offset="1"          stop-color="#585858"          id="stop743" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.02929688,0.02929688,0,344,484)"        id="gradient5">       <stop          offset="0"          stop-color="#383838"          id="stop746" />       <stop          offset="1"          stop-color="#585858"          id="stop748" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.02929688,0.02929688,0,44,424)"        id="gradient6">       <stop          offset="0"          stop-color="#383838"          id="stop751" />       <stop          offset="1"          stop-color="#585858"          id="stop753" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.02929688,0.02929688,0,104,424)"        id="gradient7">       <stop          offset="0"          stop-color="#383838"          id="stop756" />       <stop          offset="1"          stop-color="#585858"          id="stop758" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.02929688,0.02929688,0,164,424)"        id="gradient8">       <stop          offset="0"          stop-color="#383838"          id="stop761" />       <stop          offset="1"          stop-color="#585858"          id="stop763" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.02929688,0.02929688,0,224,424)"        id="gradient9">       <stop          offset="0"          stop-color="#383838"          id="stop766" />       <stop          offset="1"          stop-color="#585858"          id="stop768" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.02929688,0.02929688,0,284,424)"        id="gradient10">       <stop          offset="0"          stop-color="#383838"          id="stop771" />       <stop          offset="1"          stop-color="#585858"          id="stop773" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.02929688,0.02929688,0,344,424)"        id="gradient11">       <stop          offset="0"          stop-color="#383838"          id="stop776" />       <stop          offset="1"          stop-color="#585858"          id="stop778" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.02929688,0.02929688,0,44,364)"        id="gradient12">       <stop          offset="0"          stop-color="#383838"          id="stop781" />       <stop          offset="1"          stop-color="#585858"          id="stop783" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.02929688,0.02929688,0,104,364)"        id="gradient13">       <stop          offset="0"          stop-color="#383838"          id="stop786" />       <stop          offset="1"          stop-color="#585858"          id="stop788" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.02929688,0.02929688,0,164,364)"        id="gradient14">       <stop          offset="0"          stop-color="#383838"          id="stop791" />       <stop          offset="1"          stop-color="#585858"          id="stop793" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.02929688,0.02929688,0,224,364)"        id="gradient15">       <stop          offset="0"          stop-color="#383838"          id="stop796" />       <stop          offset="1"          stop-color="#585858"          id="stop798" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.02929688,0.02929688,0,284,364)"        id="gradient16">       <stop          offset="0"          stop-color="#383838"          id="stop801" />       <stop          offset="1"          stop-color="#585858"          id="stop803" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.02929688,0.02929688,0,344,364)"        id="gradient17">       <stop          offset="0"          stop-color="#383838"          id="stop806" />       <stop          offset="1"          stop-color="#585858"          id="stop808" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.02935791,0.02929688,0,314,574)"        id="gradient18">       <stop          offset="0"          stop-color="#383838"          id="stop811" />       <stop          offset="1"          stop-color="#585858"          id="stop813" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.02935791,0.02929688,0,194,574)"        id="gradient19">       <stop          offset="0"          stop-color="#383838"          id="stop816" />       <stop          offset="1"          stop-color="#585858"          id="stop818" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.04882812,0.04882812,0,700,470)"        id="gradient20">       <stop          offset="0"          stop-color="#383838"          id="stop821" />       <stop          offset="1"          stop-color="#585858"          id="stop823" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.04882812,0.04882812,0,610,470)"        id="gradient21">       <stop          offset="0"          stop-color="#383838"          id="stop826" />       <stop          offset="1"          stop-color="#585858"          id="stop828" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.04882812,0.04882812,0,520,470)"        id="gradient22">       <stop          offset="0"          stop-color="#383838"          id="stop831" />       <stop          offset="1"          stop-color="#585858"          id="stop833" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.04882812,0.04882812,0,430,470)"        id="gradient23">       <stop          offset="0"          stop-color="#383838"          id="stop836" />       <stop          offset="1"          stop-color="#585858"          id="stop838" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.04882812,0.04882812,0,880,380)"        id="gradient24">       <stop          offset="0"          stop-color="#383838"          id="stop841" />       <stop          offset="1"          stop-color="#585858"          id="stop843" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.04882812,0.04882812,0,790,380)"        id="gradient25">       <stop          offset="0"          stop-color="#383838"          id="stop846" />       <stop          offset="1"          stop-color="#585858"          id="stop848" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.04882812,0.04882812,0,700,380)"        id="gradient26">       <stop          offset="0"          stop-color="#383838"          id="stop851" />       <stop          offset="1"          stop-color="#585858"          id="stop853" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.04882812,0.04882812,0,610,380)"        id="gradient27">       <stop          offset="0"          stop-color="#383838"          id="stop856" />       <stop          offset="1"          stop-color="#585858"          id="stop858" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.04882812,0.04882812,0,520,380)"        id="gradient28">       <stop          offset="0"          stop-color="#383838"          id="stop861" />       <stop          offset="1"          stop-color="#585858"          id="stop863" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.04882812,0.04882812,0,430,380)"        id="gradient29">       <stop          offset="0"          stop-color="#383838"          id="stop866" />       <stop          offset="1"          stop-color="#585858"          id="stop868" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.09765625,0.09765625,0,279.95,240)"        id="gradient30">       <stop          offset="0"          stop-color="#383838"          id="stop871" />       <stop          offset="1"          stop-color="#585858"          id="stop873" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0.04142761,-0.04142761,0.04142761,0.04142761,279.95,70)"        id="gradient31">       <stop          offset="0"          stop-color="#383838"          id="stop876" />       <stop          offset="1"          stop-color="#585858"          id="stop878" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.05493164,0.05493164,0,279.95,70)"        id="gradient32">       <stop          offset="0.00392156862745098"          stop-color="#434343"          id="stop881" />       <stop          offset="1"          stop-color="#2C2C2C"          id="stop883" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.09762573,0.09762573,0,459.95,239.95)"        id="gradient33">       <stop          offset="0"          stop-color="#383838"          id="stop886" />       <stop          offset="1"          stop-color="#585858"          id="stop888" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.02935791,0.02929688,0,74,574)"        id="gradient34">       <stop          offset="0"          stop-color="#383838"          id="stop891" />       <stop          offset="1"          stop-color="#585858"          id="stop893" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.09765625,0.09765625,0,840,240)"        id="gradient35">       <stop          offset="0"          stop-color="#383838"          id="stop896" />       <stop          offset="1"          stop-color="#585858"          id="stop898" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0.05392456,-0.05392456,0.05392456,0.05392456,839.45,70.45)"        id="gradient36">       <stop          offset="0"          stop-color="#383838"          id="stop901" />       <stop          offset="1"          stop-color="#585858"          id="stop903" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.07260132,0.07260132,0,839.4,70.5)"        id="gradient37">       <stop          offset="0.00392156862745098"          stop-color="#434343"          id="stop906" />       <stop          offset="1"          stop-color="#2C2C2C"          id="stop908" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.04608154,0.04608154,0,650.5,117.75)"        id="gradient38">       <stop          offset="0"          stop-color="#383838"          id="stop911" />       <stop          offset="1"          stop-color="#585858"          id="stop913" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.0378418,0.03723145,0,692.7,200.5)"        id="gradient39">       <stop          offset="0"          stop-color="#383838"          id="stop916" />       <stop          offset="1"          stop-color="#585858"          id="stop918" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.0447998,0.04544067,0,650.5,282.7)"        id="gradient40">       <stop          offset="0"          stop-color="#383838"          id="stop921" />       <stop          offset="1"          stop-color="#585858"          id="stop923" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.03723145,0.03723145,0,607.75,200.5)"        id="gradient41">       <stop          offset="0"          stop-color="#383838"          id="stop926" />       <stop          offset="1"          stop-color="#585858"          id="stop928" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.09765625,0.09765625,0,100,240)"        id="gradient42">       <stop          offset="0"          stop-color="#383838"          id="stop931" />       <stop          offset="1"          stop-color="#585858"          id="stop933" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.05267334,0.05264282,0,100.05,70.05)"        id="gradient43">       <stop          offset="0.00392156862745098"          stop-color="#434343"          id="stop936" />       <stop          offset="1"          stop-color="#2C2C2C"          id="stop938" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0.04142761,-0.04142761,0.04142761,0.04142761,100.1,70.15)"        id="gradient44">       <stop          offset="0"          stop-color="#383838"          id="stop941" />       <stop          offset="1"          stop-color="#585858"          id="stop943" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.04882812,0.04882812,0,880,470)"        id="gradient45">       <stop          offset="0"          stop-color="#383838"          id="stop946" />       <stop          offset="1"          stop-color="#585858"          id="stop948" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.04882812,0.04882812,0,790,470)"        id="gradient46">       <stop          offset="0"          stop-color="#383838"          id="stop951" />       <stop          offset="1"          stop-color="#585858"          id="stop953" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.04882812,0.04882812,0,700,560)"        id="gradient47">       <stop          offset="0"          stop-color="#383838"          id="stop956" />       <stop          offset="1"          stop-color="#585858"          id="stop958" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.04882812,0.04882812,0,610,560)"        id="gradient48">       <stop          offset="0"          stop-color="#383838"          id="stop961" />       <stop          offset="1"          stop-color="#585858"          id="stop963" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.04882812,0.04882812,0,520,560)"        id="gradient49">       <stop          offset="0"          stop-color="#383838"          id="stop966" />       <stop          offset="1"          stop-color="#585858"          id="stop968" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.04882812,0.04882812,0,880,560)"        id="gradient50">       <stop          offset="0"          stop-color="#383838"          id="stop971" />       <stop          offset="1"          stop-color="#585858"          id="stop973" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.04882812,0.04882812,0,790,560)"        id="gradient51">       <stop          offset="0"          stop-color="#383838"          id="stop976" />       <stop          offset="1"          stop-color="#585858"          id="stop978" />     </linearGradient>     <linearGradient        gradientUnits="userSpaceOnUse"        x1="-819.20001"        x2="819.20001"        spreadMethod="pad"        gradientTransform="matrix(0,-0.04882812,0.04882812,0,430,560)"        id="gradient52">       <stop          offset="0"          stop-color="#383838"          id="stop981" />       <stop          offset="1"          stop-color="#585858"          id="stop983" />     </linearGradient>     <linearGradient        id="gradient43-5"        gradientTransform="matrix(0,-0.05267334,0.05264282,0,-2.050001,-2.099999)"        spreadMethod="pad"        x2="819.20001"        x1="-819.20001"        gradientUnits="userSpaceOnUse">       <stop          id="stop936-5"          stop-color="#434343"          offset="0.00392156862745098" />       <stop          id="stop938-4"          stop-color="#2C2C2C"          offset="1" />     </linearGradient>     <linearGradient        id="gradient44-1"        gradientTransform="matrix(0.04142761,-0.04142761,0.04142761,0.04142761,-2.000001,-1.999999)"        spreadMethod="pad"        x2="819.20001"        x1="-819.20001"        gradientUnits="userSpaceOnUse">       <stop          id="stop941-8"          stop-color="#383838"          offset="0" />       <stop          id="stop943-8"          stop-color="#585858"          offset="1" />     </linearGradient>     <linearGradient        id="gradient42-8"        gradientTransform="matrix(0,-0.09765625,0.09765625,0,0,3e-6)"        spreadMethod="pad"        x2="819.20001"        x1="-819.20001"        gradientUnits="userSpaceOnUse">       <stop          id="stop931-2"          stop-color="#383838"          offset="0" />       <stop          id="stop933-0"          stop-color="#585858"          offset="1" />     </linearGradient>     <linearGradient        id="gradient51-1"        gradientTransform="matrix(0,-0.04882812,0.04882812,0,790,560)"        spreadMethod="pad"        x2="819.20001"        x1="-819.20001"        gradientUnits="userSpaceOnUse">       <stop          id="stop976-8"          stop-color="#383838"          offset="0" />       <stop          id="stop978-8"          stop-color="#585858"          offset="1" />     </linearGradient>   </defs>   <g      transform="translate(-750,-520)"      id="shoot">     <path        style="fill:url(#gradient51-1)"        inkscape:connector-curvature="0"        stroke="none"        fill="url(#gradient51)"        d="M 818.25,588.25 Q 806.55,600 790,600 773.35,600 761.65,588.25 750,576.55 750,560 750,543.45 761.65,531.7 773.35,520 790,520 q 16.55,0 28.25,11.7 11.75,11.75 11.75,28.3 0,16.55 -11.75,28.25 m -4.05,-4.05 q 10.1,-9.95 10.1,-24.2 0,-14.15 -10.1,-24.25 -9.95,-10.05 -24.2,-10.05 -14.25,0 -24.25,10.05 -10.05,10.1 -10.05,24.25 0,14.25 10.05,24.2 10,10.1 24.25,10.1 14.25,0 24.2,-10.1"        id="path1200" />     <path        inkscape:connector-curvature="0"        stroke="none"        fill="#383838"        d="m 814.2,584.2 q -9.95,10.1 -24.2,10.1 -14.25,0 -24.25,-10.1 -10.05,-9.95 -10.05,-24.2 0,-14.15 10.05,-24.25 10,-10.05 24.25,-10.05 14.25,0 24.2,10.05 10.1,10.1 10.1,24.25 0,14.25 -10.1,24.2"        id="path1202" />   </g> </svg> `;

const r = (t: string): SVGSVGElement => {
	const d = <div></div>;
	d.innerHTML = t;
	return d.firstElementChild as SVGSVGElement;
};

class OnscreenButton extends Component {
	public static readonly tagName = "wf-onscreen-button";
	protected _background = r(BackgroundSVG);
	private _pressed: boolean = false;
	public label: string;

	connectedCallback() {
		super.connectedCallback();
		this.appendChild(this._background);
		this.appendChild(<label>{this.label}</label>);
		this.addEventListener("touchstart", this);
		this.addEventListener("touchend", this);
		this.addEventListener("touchcancel", this);
	}

	disconnectedCallback() {
		this.removeEventListener("touchstart", this);
		this.removeEventListener("touchend", this);
		this.removeEventListener("touchcancel", this);
		this.textContent = "";
		super.disconnectedCallback();
	}

	handleEvent(event: TouchEvent) {
		this._pressed = event.type === "touchstart";
		if (event.type === "touchstart") this.classList.add("pressed");
		else this.classList.remove("pressed");

		event.preventDefault();
		event.stopPropagation();
	}

	public get pressed() {
		return this._pressed;
	}
}

export default OnscreenButton;
