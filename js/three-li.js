var scene, camera, renderer;
var cloud, controls;
(function(){
    function init() {
        scene = new THREE.Scene();//场景

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);//透视相机
        camera.position.set(0, 0, 300);//相机位置
        scene.add(camera);//add到场景中

        renderer = new THREE.WebGLRenderer({antialias: true});//渲染
        renderer.setClearColor(0x00000);//设置可以认为是底图的颜色
        renderer.setSize($('#cloud').width(), $('#cloud').height());
        renderer.shadowMapEnabled = true;//shadow，阴影，表明能渲染阴影
        document.getElementById('cloud').appendChild(renderer.domElement);//将渲染Element添加到Dom中

        /*
        控制器，用于选择创建粒子的数量大小等
        */
        controls = new function () {
            this.createNums = 5000;//默认创建5000个粒子
            this.size = 7;//默认大小
            this.transparent = true;//透明的
            this.opacity = 0.8;//不透明
            this.vertexColors = true;//坐标点集颜色
            this.color = '#3f7fa2';//控制器本身颜色
            this.sizeAttenuation = true;//如果为false 则所有粒子拥有相同的尺寸。无论距离相机多远
            this.rotateSystem = true;//是否旋转
            this.rotateSpeed = 0.005;//默认旋转速度
            this.redraw = function () {
                if (scene.getObjectByName('particles')) {
                    scene.remove(scene.getObjectByName('particles'));
                }//存在则清除，然后重制
                createParticles(controls.createNums, controls.size, controls.transparent, controls.opacity, controls.vertexColors, controls.sizeAttenuation, controls.color);
            }
        };
        controls.redraw();
        render();
    }
    /*
    该函数用于生成粒子
    */
    function createParticles(createNums, size, transparent, opacity, vertexColors, sizeAttenuation, color) {
        //几何体
        var geom = new THREE.Geometry();
        //粒子系统材质，
        var material = new THREE.PointCloudMaterial({
            size: size,
            transparent: transparent,
            opacity: opacity,
            vertexColors: vertexColors,
            sizeAttenuation: sizeAttenuation,
            blending:true,
            map: THREE.ImageUtils.loadTexture('./images/li.png'),
            color: color
        });

        var range = 500;
        for (var i = 0; i < createNums; i++) {
            var particle = new THREE.Vector3(Math.random() * range - range / 2,
                    Math.random() * range - range / 2, Math.random() * range - range / 2);
            geom.vertices.push(particle);//点加入
            var color = new THREE.Color('#3f7fa2');//默认,关于颜色的设置只在vertexColors设置为true时使用
            color.setHSL(color.getHSL().h, color.getHSL().s, Math.random() * color.getHSL().l);
            geom.colors.push(color);//颜色加入
        }
        cloud = new THREE.PointCloud(geom, material);//粒子云系统
        cloud.name = 'particles';//命名名字，在重绘的时候使用
        scene.add(cloud);
    }

    var step = 0;
    function render() {
        if (controls.rotateSystem) {
            step += controls.rotateSpeed;
            cloud.rotation.x = step;
            // cloud.rotation.y = step;
            cloud.rotation.z = step;
        }//旋转起来
        requestAnimationFrame(render);//html5的方法，用于绘制一次动画帧
        renderer.render(scene, camera);

    }
    window.onload = init;
    window.onresize = function(){
        $('#cloud').empty();
        init();
    };
})();