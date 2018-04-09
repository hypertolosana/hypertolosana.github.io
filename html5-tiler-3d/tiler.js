//
// Tiler by Hyperandroid.com is licensed under a Creative Commons Attribution-ShareAlike 3.0 Unported License.
//
//
(function(){ImagePreloader=function(){this.images=[];return this};ImagePreloader.prototype={images:null,notificationCallback:null,imageCounter:0,addImage:function(a){var b=this,c=new Image;this.images.push(c);c.url=a;c.onload=function(){b.imageCounter++;b.imageCounter===b.images.length&&b.notificationCallback.call(b,b.images)}},getLoadedImages:function(){return this.images},setCallback:function(a){this.imageCounter=0;this.notificationCallback=a;for(a=0;a<this.images.length;a++)this.images[a].src=
this.images[a].url}}})();var m_awidth,m_aheight,m_sizeImgW,m_sizeImgH,loadedImages=0,canvas=null,imageLoader,m_pictures=[],pause=2500,min_rows=8,min_cols=8,extra_rows=12,extra_cols=12,transition_time=5E3,m_pause=0,m_nRows=16,m_nColumns=16,m_giro=null,mosaicTime=32,m_tilePosition=null,m_tileMapCoords=null,m_ctexture=0,m_tgm=0,parentdir=0,startTime=0,totalTime=0,enable2AXIS=true,m_points=null,m_planes=null,m_map=null,m_matrix=null,m_projectPoints=null,m_normals=null,m_visiblePlanes=null,m_position=null,m_nPoints=4,m_nNormals=
2,m_nPolygons=2,m_nMapCoordsByPlane=4,m_nPointsByPlane=4,xy=0,xz=0,yz=0,pxy=0,pxz=0,pyz=0,m_tilingDir=null,drawnPolygons,interval=null,timeStep=20;function nArray(a){for(var b=[],c=0;c<a;c++)b.push(0);return b}function setupStuff(){m_map=nArray(m_nMapCoordsByPlane*2*m_nPolygons);m_projectPoints=nArray(m_nPoints*2);m_visiblePlanes=nArray(m_nPolygons);m_matrix=nArray(16);m_matrix2=nArray(16);m_position=nArray(6);for(var a=0;a<6;a++)m_position[a]=0}
function buildVertex(a,b){m_points=nArray(m_nPoints*6);m_points[0]=-1;m_points[1]=-1;m_points[2]=0;m_points[3]=-1;m_points[4]=-1;m_points[5]=0;m_points[6]=1;m_points[7]=-1;m_points[8]=0;m_points[9]=1;m_points[10]=-1;m_points[11]=0;m_points[12]=1;m_points[13]=1;m_points[14]=0;m_points[15]=1;m_points[16]=1;m_points[17]=0;m_points[18]=-1;m_points[19]=1;m_points[20]=0;m_points[21]=-1;m_points[22]=1;m_points[23]=0;prepareVertex(a,b)}
function prepareVertex(a,b){for(var c=0;c<m_nPoints;c++){m_points[c*6]*=a;m_points[c*6+1]*=b;m_points[c*6+3]*=a;m_points[c*6+4]*=b}}function buildPlanes(){m_planes=nArray(m_nPolygons*m_nPointsByPlane);m_planes[0]=0;m_planes[1]=1;m_planes[2]=2;m_planes[3]=3;m_planes[4]=3;m_planes[5]=2;m_planes[6]=1;m_planes[7]=0;buildNormals()}
function buildNormals(){m_normals=nArray(m_nPolygons*6);for(var a=0;a<m_nPolygons;a++){var b=m_planes[a*m_nPointsByPlane+2],c=m_planes[a*m_nPointsByPlane+1],e=m_planes[a*m_nPointsByPlane],d=m_points[b*6]-m_points[e*6],f=m_points[b*6+1]-m_points[e*6+1],g=m_points[b*6+2]-m_points[e*6+2];b=m_points[c*6]-m_points[e*6];var j=m_points[c*6+1]-m_points[e*6+1];e=m_points[c*6+2]-m_points[e*6+2];c=f*e-g*j;g=g*b-d*e;d=d*j-b*f;f=Math.sqrt(c*c+g*g+d*d);if(f==0)f=1;c/=f;g/=f;d/=f;m_normals[a*6]=c;m_normals[a*6+
1]=g;m_normals[a*6+2]=d;m_normals[a*6+3]=c;m_normals[a*6+4]=g;m_normals[a*6+5]=d}}
function doit(){for(var a=(new Date).getTime()-startTime,b=0,c=drawnPolygons=0;c<m_nRows;c++)for(var e=0;e<m_nColumns;e++){var d=e+c*m_nColumns;setPos(m_tilePosition[d*6+3],m_tilePosition[d*6+4],m_tilePosition[d*6+5]);var f=m_giro[d];if(a<f)f=0;else{f=a-f;if(f>mosaicTime){f=mosaicTime;b++}else if(f<0)f=0}var g=Math.PI/mosaicTime*f;switch(m_tilingDir[d]){case 0:xz=g;yz=0;break;case 1:yz=g;xz=0;break;case 2:xz=2*g;yz=g;break}mapFace(d*8,m_tilingDir[d]);draw(mosaicTime-f)}if(b==m_nRows*m_nColumns){parentdir=
enable2AXIS?Math.floor(Math.random()*7.99):7;m_ctexture++;setDirs();buildMosaicModel(m_awidth,m_aheight,m_sizeImgW,m_sizeImgH);if(null!=interval){clearInterval(interval);setTimeout(function(){startTime=(new Date).getTime();interval=setInterval(_doit,timeStep)},pause)}}}function buildMosaicModel(a,b,c,e){mosaicTime=transition_time;setup(a,b,c,e)}
function giroMatrix(){if(m_tgm>7)m_tgm=0;for(var a=500+Math.floor(1E3*Math.random()),b=0;b<m_nRows;b++)for(var c=0;c<m_nColumns;c++){var e=c+b*m_nColumns,d,f;switch(m_tgm){case 7:d=c-m_nColumns/2;f=b-m_nRows/2;m_giro[e]=Math.floor(a*Math.sqrt(d*d+f*f));totalTime=mosaicTime+a;break;case 1:d=c-m_nColumns/2;f=b-m_nRows/2;m_giro[e]=Math.floor(a-a*Math.sin(d)*Math.cos(f));totalTime=mosaicTime+a;break;case 3:m_giro[e]=Math.abs(c-b)/Math.max(m_nRows,m_nColumns)*a;totalTime=mosaicTime+a;break;case 0:m_giro[e]=
Math.floor(a-a*Math.sin(b/m_nColumns)*Math.cos(c/m_nRows));totalTime=mosaicTime+a;break;case 4:m_giro[e]=b/m_nRows*a;totalTime=mosaicTime+a;break;case 5:m_giro[e]=c/m_nColumns*a;totalTime=mosaicTime+a;break;case 6:m_giro[e]=Math.floor(Math.random()*a);totalTime=mosaicTime+a;break;case 2:d=c-m_nColumns/2;f=b-m_nRows/2;m_giro[m_nRows*m_nColumns-e-1]=a+a*Math.sin(d*f/(m_nRows+m_nColumns));totalTime=mosaicTime+a;break;default:m_giro[c+b*m_nColumns]=a*(b+c*m_nRows+c);totalTime=mosaicTime+a}}m_tgm++}
function remapCoords(){for(var a=(m_sizeImgW-1)/m_nColumns,b=(m_sizeImgH-1)/m_nRows,c=0;c<m_nRows;c++)for(var e=0;e<m_nColumns;e++){var d=e+c*m_nColumns;m_tileMapCoords[d*8]=Math.floor((m_nColumns-1-e)*a);m_tileMapCoords[d*8+1]=Math.floor((m_nRows-1-c)*b);m_tileMapCoords[d*8+2]=Math.floor(a+(m_nColumns-1-e)*a);m_tileMapCoords[d*8+3]=Math.floor((m_nRows-1-c)*b+b);m_tileMapCoords[d*8+4]=m_tileMapCoords[d*8];m_tileMapCoords[d*8+5]=m_tileMapCoords[d*8+1];m_tileMapCoords[d*8+6]=m_tileMapCoords[d*8+2];
m_tileMapCoords[d*8+7]=m_tileMapCoords[d*8+3]}}
function setup(a,b,c,e){a=min_rows;if(extra_rows>0)a+=Math.floor(Math.random()*extra_rows);b=min_cols;if(extra_cols>0)b+=Math.floor(Math.random()*extra_cols);m_giro=nArray(a*b);m_nRows=a;m_nColumns=b;m_tilePosition=nArray(a*b*6);m_tileMapCoords=nArray(a*b*8);c=c/b;e=e/a;m_tilingDir=nArray(m_nRows*m_nColumns);buildVertex(c,e);buildPlanes();for(a=0;a<m_nRows;a++)for(b=0;b<m_nColumns;b++){var d=b+a*m_nColumns;m_tilePosition[d*6]=(b-m_nColumns/2)*2*c+c;m_tilePosition[d*6+1]=(m_nRows/2-a)*2*e-e;m_tilePosition[d*
6+2]=-512;m_tilePosition[d*6+3]=m_tilePosition[d*6];m_tilePosition[d*6+4]=m_tilePosition[d*6+1];m_tilePosition[d*6+5]=m_tilePosition[d*6+2]}setDirs();giroMatrix();remapCoords()}function setDirs(){var a;a=Math.random();a=a<0.25?0:a<0.5?1:a<0.75?2:3;if(a==2)for(var b=0;b<m_nRows*m_nColumns;b++)m_tilingDir[b]=Math.random()>0.5?0:1;else for(b=0;b<m_nRows*m_nColumns;b++)switch(a){case 0:m_tilingDir[b]=0;break;case 1:m_tilingDir[b]=1;break;case 3:m_tilingDir[b]=2;break}}
function draw(a){if(a<0)a=0;else if(a>mosaicTime)a=mosaicTime;rotate(xy,xz,yz);setupCoords();movePos(a);setupNormals();project();drawPlanes()}function project(){for(var a=0;a<m_nPoints;a++){var b=m_points[a*6+5];if(b==0)b=1;m_projectPoints[a*2]=Math.floor(m_awidth/2+m_points[a*6+3]*256/b);m_projectPoints[a*2+1]=Math.floor(m_aheight/2-m_points[a*6+4]*256/b)}}
function rotateParent(){var a=Math.sin(pxy),b=Math.sin(pxz),c=Math.sin(pyz),e=Math.cos(pxy),d=Math.cos(pxz),f=Math.cos(pyz);m_matrix2[0]=d*e;m_matrix2[1]=-d*a;m_matrix2[2]=b;m_matrix2[3]=0;m_matrix2[4]=c*b*e+a*f;m_matrix2[5]=f*e-c*b*a;m_matrix2[6]=-c*d;m_matrix2[7]=0;m_matrix2[8]=c*a-f*b*e;m_matrix2[9]=f*b*a+c*e;m_matrix2[10]=f*d;m_matrix2[11]=m_position[5];m_matrix2[12]=0;m_matrix2[13]=0;m_matrix2[14]=0;m_matrix2[15]=1}
function rotate(a,b,c){var e=Math.sin(a),d=Math.sin(b),f=Math.sin(c);a=Math.cos(a);b=Math.cos(b);c=Math.cos(c);m_matrix[0]=b*a;m_matrix[1]=-b*e;m_matrix[2]=d;m_matrix[3]=m_position[3];m_matrix[4]=f*d*a+e*c;m_matrix[5]=c*a-f*d*e;m_matrix[6]=-f*b;m_matrix[7]=m_position[4];m_matrix[8]=f*e-c*d*a;m_matrix[9]=c*d*e+f*a;m_matrix[10]=c*b;m_matrix[11]=0;m_matrix[12]=0;m_matrix[13]=0;m_matrix[14]=0;m_matrix[15]=1}
function movePos(a){switch(parentdir){case 0:pxy=0;pxz=-a*2*Math.PI/mosaicTime;break;case 1:pxy=-2*a*2*Math.PI/mosaicTime;pxz=-a*2*Math.PI/mosaicTime;break;case 2:pyz=-a*2*Math.PI/mosaicTime;break;case 3:pxy=0;pxz=a*2*Math.PI/mosaicTime;break;case 4:pxy=2*a*2*Math.PI/mosaicTime;pxz=a*2*Math.PI/mosaicTime;break;case 5:pyz=a*2*Math.PI/mosaicTime;break;case 6:pxy=-2*a*2*Math.PI/mosaicTime;pxz=a*2*Math.PI/mosaicTime;break;case 7:pyz=pxz=pxy=0;break}rotateParent();for(a=0;a<m_nPoints;a++){var b=m_points[a*
6+3],c=m_points[a*6+4],e=m_points[a*6+5];m_points[a*6+3]=b*m_matrix2[0]+c*m_matrix2[1]+e*m_matrix2[2]+m_matrix2[3];m_points[a*6+4]=b*m_matrix2[4]+c*m_matrix2[5]+e*m_matrix2[6]+m_matrix2[7];m_points[a*6+5]=b*m_matrix2[8]+c*m_matrix2[9]+e*m_matrix2[10]+m_matrix2[11]}}
function setupNormals(){for(var a=0;a<m_nNormals;a++){var b=m_normals[a*6],c=m_normals[a*6+1],e=m_normals[a*6+2],d=b*m_matrix[0]+c*m_matrix[1]+e*m_matrix[2],f=b*m_matrix[4]+c*m_matrix[5]+e*m_matrix[6];b=b*m_matrix[8]+c*m_matrix[9]+e*m_matrix[10];m_normals[a*6+3]=d*m_matrix2[0]+f*m_matrix2[1]+b*m_matrix2[2];m_normals[a*6+4]=d*m_matrix2[4]+f*m_matrix2[5]+b*m_matrix2[6];m_normals[a*6+5]=d*m_matrix2[8]+f*m_matrix2[9]+b*m_matrix2[10];m_visiblePlanes[a]=m_normals[a*6+3]*m_points[m_planes[a*m_nPointsByPlane+
0]*6+3]+m_normals[a*6+4]*m_points[m_planes[a*m_nPointsByPlane+0]*6+4]+m_normals[a*6+5]*m_points[m_planes[a*m_nPointsByPlane+0]*6+5]>0}}function setupCoords(){for(var a=0;a<m_nPoints;a++){var b=m_points[a*6],c=m_points[a*6+1],e=m_points[a*6+2];m_points[a*6+3]=b*m_matrix[0]+c*m_matrix[1]+e*m_matrix[2]+m_matrix[3];m_points[a*6+4]=b*m_matrix[4]+c*m_matrix[5]+e*m_matrix[6]+m_matrix[7];m_points[a*6+5]=b*m_matrix[8]+c*m_matrix[9]+e*m_matrix[10]+m_matrix[11]}}
function mapFace(a,b){m_map[0]=m_tileMapCoords[a+2];m_map[1]=m_tileMapCoords[a+1];m_map[2]=m_tileMapCoords[a];m_map[3]=m_tileMapCoords[a+1];m_map[4]=m_tileMapCoords[a];m_map[5]=m_tileMapCoords[a+3];m_map[6]=m_tileMapCoords[a+2];m_map[7]=m_tileMapCoords[a+3];a+=4;if(b==0){m_map[8]=m_tileMapCoords[a];m_map[9]=m_tileMapCoords[a+3];m_map[10]=m_tileMapCoords[a+2];m_map[11]=m_tileMapCoords[a+3];m_map[12]=m_tileMapCoords[a+2];m_map[13]=m_tileMapCoords[a+1];m_map[14]=m_tileMapCoords[a];m_map[15]=m_tileMapCoords[a+
1]}else if(b==1||b==2){m_map[8]=m_tileMapCoords[a+2];m_map[9]=m_tileMapCoords[a+1];m_map[10]=m_tileMapCoords[a];m_map[11]=m_tileMapCoords[a+1];m_map[12]=m_tileMapCoords[a];m_map[13]=m_tileMapCoords[a+3];m_map[14]=m_tileMapCoords[a+2];m_map[15]=m_tileMapCoords[a+3]}}
function drawTri(a,b,c,e,d){var f=b*m_nPointsByPlane,g=m_projectPoints[m_planes[f+c]*2],j=m_projectPoints[m_planes[f+c]*2+1],k=m_projectPoints[m_planes[f+e]*2],l=m_projectPoints[m_planes[f+e]*2+1],m=m_projectPoints[m_planes[f+d]*2],n=m_projectPoints[m_planes[f+d]*2+1];if(!(j===l&&j===n||g===k&&g===m)){a.save();a.beginPath();a.moveTo(g,j);a.lineTo(k,l);a.lineTo(m,n);a.closePath();a.clip();f*=2;var o=m_map[f+c*2];c=m_map[f+c*2+1];var h=m_map[f+e*2];e=m_map[f+e*2+1];var i=m_map[f+d*2];d=m_map[f+d*2+
1];f=o*(d-e)-h*d+i*e+(h-i)*c;if(f!=0){a.setTransform(-(c*(m-k)-e*m+d*k+(e-d)*g)/f,(e*n+c*(l-n)-d*l+(d-e)*j)/f,(o*(m-k)-h*m+i*k+(h-i)*g)/f,-(h*n+o*(l-n)-i*l+(i-h)*j)/f,(o*(d*k-e*m)+c*(h*m-i*k)+(i*e-h*d)*g)/f,(o*(d*l-e*n)+c*(h*n-i*l)+(i*e-h*d)*j)/f);a.drawImage(m_pictures[(m_ctexture+b)%m_pictures.length],0,0)}a.restore()}}function drawPlanes(){for(var a=0;a<m_nPolygons;a++)if(m_visiblePlanes[a]==true){drawnPolygons+=2;drawTri(ctx,a,0,1,2);drawTri(ctx,a,0,2,3)}}
function app_size(a,b,c,e){var d;e=a/e;d=b/c;var f=-e;f=0;c=-d;f=-a;c=512-d;d=Math.floor(Math.ceil(a/2+f*256/c));d=d<0?-d+1:0;f=b;c=512-e;e=Math.floor(b/2-f*256/c);e=e<0?-e+1:0;m_awidth=d*2+a;m_aheight=e*2+b;m_awidth+=200;m_aheight+=200}function _doit(){ctx=canvas.getContext("2d");ctx.globalAlpha=1;ctx.fillStyle="#f0f0f0";ctx.fillRect(0,0,m_awidth,m_aheight);ctx.globalAlpha=1;doit()}function setPos(a,b,c){m_position[0]=m_position[3]=a;m_position[1]=m_position[4]=b;m_position[2]=m_position[5]=c};

function init(loadedImages) {
 
        m_pictures= loadedImages;
        m_sizeImgW= m_pictures[0].width;
        m_sizeImgH= m_pictures[0].height;
 
        for( var i=1; i<loadedImages.length; i++ )  {
            if ( m_pictures[i].width != m_sizeImgW || m_pictures[i].height != m_sizeImgH )  {
                alert("Images must be equal sized. Tiler3D won't run.");
                return;
            }
        }
 
        canvas= document.getElementById('screen');
 
        document.getElementById('min_rows').addEventListener(
            'change',
            function(e) {
                min_rows= parseInt(document.getElementById('min_rows').value);
            },
            false);
        document.getElementById('min_cols').addEventListener(
            'change',
            function(e) {
                min_cols= parseInt(document.getElementById('min_cols').value);
            },
            false);
        document.getElementById('extra_rows').addEventListener(
            'change',
            function(e) {
                extra_rows= parseInt(document.getElementById('extra_rows').value);
            },
            false);
        document.getElementById('extra_cols').addEventListener(
            'change',
            function(e) {
                extra_cols= parseInt(document.getElementById('extra_cols').value);
            },
            false);
        document.getElementById('transition_time').addEventListener(
            'change',
            function(e) {
                transition_time= parseInt(document.getElementById('transition_time').value);
            },
            false);
 
        document.getElementById('double_axis').addEventListener(
            'change',
            function(e) {
                enable2AXIS = this.checked;
            },
            false);
 
        if ( m_sizeImgW==0 || m_sizeImgH==0 )    {
            alert("image error. tiler3d won't run.");
            return;
        }
 
        app_size(m_sizeImgW, m_sizeImgH, m_nRows, m_nColumns );
 
        setupStuff();
        buildMosaicModel( m_awidth,m_aheight,m_sizeImgW,m_sizeImgH );
 
        if (interval != null){
            clearInterval(interval);
        }
 
        canvas.width  = m_awidth;
        canvas.height = m_aheight;
 
        startTime= new Date().getTime();
        currentTime= startTime;
        interval = setInterval(_doit, timeStep);
    }
 
       
imageLoader = new ImagePreloader();
imageLoader.addImage('https://hypertolosana.files.wordpress.com/2018/04/l1.jpg');
imageLoader.addImage('https://hypertolosana.files.wordpress.com/2018/04/l2.jpg');

imageLoader.setCallback(init);
