<template>
<b-container>
    <b-row >
        <b-col cols="4" style="height:800px; overflow-y: scroll;" ref="samplelistcontent">
            <b-container>                
                <b-row style="border-bottom: 1px solid rgba(0, 0, 0, 0.1);">
                    <b-col class="m-md-2"  style="border-right: 1px solid rgba(0, 0, 0, 0.1);">
                        <div style="width: 40px;display: flex;height: 100%;align-items: center;">
                        ID
                        </div>
                    </b-col>                
                    <b-col class="m-md-2"  style="border-right: 1px solid rgba(0, 0, 0, 0.1);">
                        <div style="width: 40px;display: flex;height: 100%;align-items: center;">
                            <b-icon icon="bounding-box-circles" scale="1" variant="info"></b-icon>
                        </div>
                    </b-col>
                    <b-col class="m-md-2"  style="border-right: 1px solid rgba(0, 0, 0, 0.1);">
                        <div style="width: 40px;display: flex;height: 100%;align-items: center;">
                        图片
                        </div>
                    </b-col>
                    <b-col class="m-md-2">
                        <div style="width: 40px;display: flex;height: 100%;align-items: center;">
                        信息
                        </div>
                    </b-col>
                </b-row>
                <b-row v-for="(sample, sample_i) in samples" :key="sample_i" class="row_activate" :class="{'row_activate_selected': sample_i==activate_sample['sample_id']}" @click="select(sample['sample_id'])">
                    <b-col>
                        <div class="dm-table__cell" style="margin-top: 7px;">
                            <div style="width: 20px;display: flex;height: 100%;align-items: center;">
                                {{sample['sample_id']}}
                            </div>
                        </div>
                    </b-col>
                    <b-col>
                        <div class="dm-table__cell" style="margin-top: 7px;">
                            
                            <div v-if="sample['state'] != 'completed'" style="width: 5px;display: flex;height: 100%;align-items: center;">
                                {{sample['label_info'].length}}
                            </div>
                            <div v-else style="width: 5px;display: flex;height: 100%;align-items: center; color: red; font-weight: bold;">
                                {{sample['label_info'].length}}
                            </div>
                        </div>
                    </b-col>
                    <b-col>
                        <div class="dm-table__cell">
                            <div style="width: 40px;display: flex;height: 100%;align-items: center;">
                                <img :src="sample['image_file']" width="40" height="40">
                            </div>
                        </div>
                    </b-col>    
                    <b-col>
                        <div class="dm-table__cell" style="margin-top: 7px;">
                            <div style="width: 40px;display: flex;height: 100%;align-items: center;">
                                <b-icon icon="code-slash" scale="1" variant="info" style="cursor: pointer"></b-icon>

                            </div>
                        </div>
                    </b-col>                
                </b-row>
            </b-container>
        </b-col>
        <b-col cols="8" style='border-left: 1px solid rgba(0, 0, 0, 0.1);'>
            <b-container>
                <b-row style="border-bottom: 1px solid rgba(0, 0, 0, 0.1);">
                    <b-col  style="border-right: 1px solid rgba(0, 0, 0, 0.1); display: flex; flex-direction: row; justify-content: center;">
                        <div class="dm-table__cell">
                            <div style="width: 40px; display: flex;height: 100%;align-items: center;">
                                #{{activate_sample['sample_id']}}
                            </div>
                        </div>                        
                    </b-col>
                    <b-col  style="border-right: 1px solid rgba(0, 0, 0, 0.1);">
                        <div class="dm-table__cell">
                        <div style="width: 200px;display: flex;height: 100%;align-items: center;">
                            <div class="lsf-space lsf-space_direction_horizontal lsf-space_size_small">
                                <div block="lsf-annotations-list" class="lsf-userpic lsf-annotations-list__userpic" style="background: rgb(179, 218, 216); color: rgb(0, 0, 0);">
                                    <img :alt="label_operator['full_name']" class="lsf-userpic__avatar" style="opacity: 0;">
                                    <span class="lsf-userpic__username">{{label_operator['short_name']}}</span>
                                </div>
                                <div class="lsf-space lsf-space_direction_vertical lsf-space_size_none">
                                    <div class="lsf-annotations-list__user">
                                        <span class="lsf-annotations-list__name">{{label_operator['full_name']}}</span>
                                        <span class="lsf-annotations-list__entity-id">#{{activate_sample['sample_id']}}</span>
                                    </div>
                                    
                                    <div v-if="activate_sample['state'] != 'completed'" class="lsf-annotations-list__created">created,
                                        <time class="lsf-annotations-list__date" tag="div">{{activate_sample['created_time']}}</time>
                                    </div>
                                    <!-- <div></div> -->
                                    <div v-else class="lsf-annotations-list__created">
                                        <div >completed,
                                            <time class="lsf-annotations-list__date" tag="div">{{activate_sample['completed_time']}}</time>
                                        </div>   
                                        <div >update,
                                            <time class="lsf-annotations-list__date" tag="div">{{activate_sample['update_time']}}</time>
                                        </div>    
                                    </div>
                                        
                                </div>
                            </div>
                        </div>
                        </div>

                    </b-col>
                    <b-col style="border-right: 1px solid rgba(0, 0, 0, 0.1); display: flex; flex-direction: row; justify-content: center;">
                        <div class="dm-table__cell" style="margin-top: 7px">
                            <div style="display: flex;height: 100%;align-items: center;">
                                <b-icon icon="trash" scale="2" variant="info" style="cursor: pointer" @click="remove_annotations()"></b-icon>
                            </div>
                        </div>

                    </b-col>                
                    <b-col style="display: flex; flex-direction: row; justify-content: center;">
                        <div class="dm-table__cell">
                        <div style="width: 100%;display: flex;height: 100%;align-items: center;">

                        <b-button v-if="activate_sample['state'] != 'completed'" variant="primary" style="width:100px" @click="update_annotations()">提交</b-button>
                        <b-button v-else variant="primary" style="width:100px" @click="update_annotations()">更新</b-button>

                        </div>
                        </div>
                    </b-col>
                    <b-col style="display: flex; flex-direction: row; justify-content: center;">
                        <div class="dm-table__cell">
                        <div style="width: 100%;display: flex;height: 100%;align-items: center;">
                        <b-button variant="primary" style="width:100px" @click="next()">下一个</b-button>
                        </div>
                        </div>
                    </b-col>                        
                </b-row>
            </b-container>

            <b-container>
                <b-row>
                    <b-col>
                        <b-container>
                            <b-row>
                                <b-col style="height:400px">
                                    <div >
                                        <div id="label-image"></div>
                                    </div>
                                </b-col>
                            </b-row>
                            <hr>
                            <b-row v-if="label_metas['label_level']=='instance-level'">
                                <b-col v-for="(t,index) in label_metas['label_category']" :key="index">
                                    <b-badge v-if="index!=label_metas['activate_label_index']" :style="{'width': '100px', 'height': '20px', 'background-color':t['background_color'], 'color': t['color'], 'cursor': 'pointer'}" @click="switch_label_category(label_type,index, t)">{{t['class_name']}} ({{t['class_index']}})</b-badge>
                                    <b-badge v-else :style="{'width': '100px', 'height': '20px', 'background-color':'yellow', 'color': t['color'], 'cursor': 'pointer'}" @click="switch_label_category(label_type, index, t)">{{t['class_name']}} ({{t['class_index']}})</b-badge>
                                </b-col>
                            </b-row>       
                            <b-row v-else>
                                <b-col>
                                    <div class="form-check" v-for="(t,index) in label_metas['label_category']" :key="index">
                                        <input class="form-check-input" type="checkbox" v-model="choices" :value="t['class_name']">
                                        <label class="form-check-label">
                                            {{ t['class_name'] }}
                                        </label>
                                    </div>                               
                                </b-col>
                            </b-row>                   
                        </b-container>
                    </b-col>
                </b-row>
            </b-container>
        </b-col>
    </b-row>

</b-container>
</template>

<script>
// eslint-disable-next-line no-unused-vars
 import AILabel from "ailabel";
 export default{
    name: 'Label',
    data() {
        return {
          img:require("../assets/logo.png"),
          gMap: null,                           //  AILabel实例
          gFirstFeatureLayer: null,             //  矢量图层实例(矩形，多边形等矢量)
          gFirstImageLayer: null,               //  图像层
          label_metas:{
            label_category: [],
            label_level: '',
            activate_label_index: -1,
          },
          samples:[],
          activate_sample: {},
          label_operator: {
            'full_name': '',
            'short_name': ''
          },
          now_page: 0,
          page_size: 50,
          more_show: true,
          task_name: '',
          task_type: '',
          label_type: '',

          choices: []
        };
      },
    mounted: function(){
        // 1.step 获得系统信息
        var _this = this;
        _this.axios.get('/antgo/api/label/task/').then(function(res){
            _this.task_name = res.data.content['task_name']
            _this.task_type = res.data.content['task_type']
            _this.label_type = res.data.content['label_type']
            
            _this.label_operator = res.data.content['operator']
            _this.label_metas['label_category'] = res.data.content['label_metas']['label_category']
            _this.label_metas['label_level'] = res.data.content['label_metas']['level']
            // 初始化绘图模块
            _this.initMap();
            // 初始化绘图模式
            _this.setMode(_this.label_type);
        }).catch(function(error){
            // do nothing
            console.log(error)
        })

        // 2.step 获取样本列表
        // 获得初始样本列表
        _this.scrollMore(_this.$route.params.id);
        _this.$refs.samplelistcontent.addEventListener('scroll', this.handleScroll, true);

        // 3.step 获得当前默认样本
        _this.axios.get(
            '/antgo/api/label/sample/get/', {
                params: {
                    'sample_i': _this.$route.params.id
                }
            }).then(function(res){
            // 开始标注指定样本
            _this.start_label_sample(res.data.content['sample'])

        }).catch(function(error){
            // do nothing
            console.log(error)
        })       
    },
    methods:{
        //初始化 标注工具并渲染
        initMap: function() {
            // npm i ailabel
            let drawingStyle = {}; // 绘制过程中样式
                const gMap = new AILabel.Map("label-image", {
                    center: {x: 100, y: 100}, // 为了让图片居中
                    zoom: 1000,
                    mode: "ban", // PAN 可以平移和放大缩小   ban  可以平移 
                    refreshDelayWhenZooming: true, // 缩放时是否允许刷新延时，性能更优
                    zoomWhenDrawing: true,
                    panWhenDrawing: false,
                    zoomWheelRatio: 5,      // 控制滑轮缩放缩率[0, 10), 值越小，则缩放越快，反之越慢
                    withHotKeys: false       // 关闭快捷键
                });
                
                // 图片层添加
                const gFirstImageLayer = new AILabel.Layer.Image(
                    "layer-image", // id
                    {
                        src: require("../assets/logo.png"),
                        width: 200,
                        height: 200,
                        crossOrigin: false, // 如果跨域图片，需要设置为true
                        position: { // 左上角相对中心点偏移量
                            x: 0,
                            y: 0
                        },
                    }, // imageInfo
                    {name: "第一个图片图层"}, // props
                    {zIndex: 5} // 这里写样式 层级
                );
                // click单击事件 这里可以直接修改单击触发 比如如果没触发可以直接把事件放进来写成单击一个点渲染
                gMap.events.on("click", point => {
                    console.log("--click--", point);
                });
                // data 代表r半径shape；data1代表sr半径shape
                gMap.events.on("drawDone", (type, data, data1) => {
                    if (type === "MARKER") {
                        const marker = new AILabel.Marker(
                            `${+new Date()}`, // id
                            {
                                src: "",
                                position: data,
                                offset: {
                                    x: 0,
                                    y:0
                                }
                            }, // markerInfo
                            {name: "第一个marker注记"} // props
                        );
                        marker.events.on("click", marker => {
                            gMap.markerLayer.removeMarkerById(marker.id);
                        });
                        gMap.markerLayer.addMarker(marker);
                    }
                    else if (type === "POINT") {
                        if (this.label_metas['activate_label_index'] < 0){
                                // do nothing
                                return;
                        }

                        data['sr'] = 5;
                        const pointFeature = new AILabel.Feature.Point(
                            `${+new Date()}`, // id
                            data, // shape
                            {
                                name: this.label_metas['label_category'][this.label_metas['activate_label_index']]['class_name'], 
                                label: this.label_metas['label_category'][this.label_metas['activate_label_index']]['class_index']  
                            }, // prop
                            {
                                fillStyle: this.label_metas['label_category'][this.label_metas['activate_label_index']]['background_color'], 
                            } // style
                        );
                        this.gFirstFeatureLayer.addFeature(pointFeature);
                    }
                    // else if (type === "CIRCLE") {
                    //     // data 代表r半径shape；data1代表sr半径shape
                    //     const circleFeature = new AILabel.Feature.Circle(
                    //         `${+new Date()}`, // id
                    //         data, // data1代表屏幕坐标 shape
                    //         {
                    //             name: this.label_metas['label_category'][this.label_metas['activate_label_index']]['class_name'], 
                    //             label: this.label_metas['label_category'][this.label_metas['activate_label_index']]['class_index']
                    //         },
                    //         {fillStyle: "#F4A460", strokeStyle: "#D2691E", lineWidth: 2} // style
                    //     );
                    //     gFirstFeatureLayer.addFeature(circleFeature);
                    // }
                    else if (type === "LINE") {
                        const scale = gMap.getScale();
                        const width = drawingStyle.lineWidth / scale;
                        const lineFeature = new AILabel.Feature.Line(
                            `${+new Date()}`, // id
                            {...data, width}, // shape
                            {name: "第一个矢量图层"}, // props
                            drawingStyle // style
                        );
                        gFirstFeatureLayer.addFeature(lineFeature);
                    }
                    // else if (type === "POLYLINE") {
                    //     if (this.label_metas['activate_label_index'] < 0){
                    //             // do nothing
                    //             return;
                    //     }
                    //     // const scale = gMap.getScale();
                    //     // const width = drawingStyle.lineWidth / scale;
                    //     const polylineFeature = new AILabel.Feature.Polyline(
                    //         `${+new Date()}`, // id
                    //         {points: data, width}, // shape
                    //         {
                    //             name: this.label_metas['label_category'][this.label_metas['activate_label_index']]['class_name'], 
                    //             label: this.label_metas['label_category'][this.label_metas['activate_label_index']]['class_index']

                    //         }, // props
                    //         {
                    //             fillStyle: this.label_metas['label_category'][this.label_metas['activate_label_index']]['background_color'], strokeStyle: this.label_metas['label_category'][this.label_metas['activate_label_index']]['color'], lineWidth: 2
                    //         } // style
                    //     );
                    //     this.gFirstFeatureLayer.addFeature(polylineFeature);
                    // }
                    else if (type === "RECT") {
                        if (this.label_metas['activate_label_index'] < 0){
                            // do nothing
                            return;
                        }
                        const rectFeature = new AILabel.Feature.Rect(
                            `${+new Date()}`,      // id
                            data,                  // shape
                            {
                                name: this.label_metas['label_category'][this.label_metas['activate_label_index']]['class_name'], 
                                label: this.label_metas['label_category'][this.label_metas['activate_label_index']]['class_index']
                            },     // props
                            {
                                fillStyle: "rgba(255,255,255,0.5)", 
                                strokeStyle: this.label_metas['label_category'][this.label_metas['activate_label_index']]['color'], 
                                lineWidth: 2,
                                fill: true,
                            } // style
                        );
                        this.gFirstFeatureLayer.addFeature(rectFeature);
                    }
                    else if (type === "POLYGON") {
                        if (this.label_metas['activate_label_index'] < 0){
                                // do nothing
                                return;
                        }
                        const polygonFeature = new AILabel.Feature.Polygon(
                            `${+new Date()}`, // id
                            {points: data}, // shape
                            {                                   
                                name: this.label_metas['label_category'][this.label_metas['activate_label_index']]['class_name'], 
                                label: this.label_metas['label_category'][this.label_metas['activate_label_index']]['class_index']
                            }, // props
                            {
                                fillStyle: "rgba(255,255,255,0.5)",
                                strokeStyle: this.label_metas['label_category'][this.label_metas['activate_label_index']]['color'], 
                                lineWidth: 2, 
                                fill: true,
                            } // style
                        );         
                        this.gFirstFeatureLayer.addFeature(polygonFeature);
                    
                    }
                }
                );
                // 视野范围发生变化
                gMap.events.on("boundsChanged", data => {
                    console.log("--map boundsChanged--");
                });
                // 在绘制模式下双击feature触发选中
                gMap.events.on("featureSelected", feature => {
                    // 双击触发删除
                    this.gFirstFeatureLayer.removeFeatureById(feature.id)
                });
                gMap.events.on("featureUnselected", () => {
                    // 取消featureSelected
                    console.log('取消激活feature')
                    gMap.setActiveFeature(null);
                });
                gMap.events.on("featureUpdated", (feature, shape) => {
                    console.log('feature updated')
                    // feature.updateShape(shape);
                    // const markerId = feature.props.deleteMarkerId;
                    // const targetMarker = gMap.markerLayer.getMarkerById(markerId);
                    // targetMarker.updatePosition(feature.getPoints()[1]);
                });
                gMap.events.on("featureDeleted", ({id: featureId}) => {
                    console.log('feature delete')
                    // gFirstFeatureLayer.removeFeatureById(featureId);
                });     
            
                // // 图片层相关事件监听
                // gFirstImageLayer.events.on("loadStart", (a, b) => {
                //     console.log("--loadStart--", a, b);
                // });
                // gFirstImageLayer.events.on("loadEnd", (a, b) => {
                //     console.log("--loadEnd--", a, b);
                // });
                // gFirstImageLayer.events.on("loadError", (a, b) => {
                //     console.log("--loadError--", a, b);
                // });
                // 添加到gMap对象
                gMap.addLayer(gFirstImageLayer);
                
                const gFirstFeatureLayer = new AILabel.Layer.Feature(
                    "first-layer-feature", // id
                    {name: "第一个矢量图层"}, // props
                    {zIndex: 10} // style
                );
                gMap.addLayer(gFirstFeatureLayer);
            
                //自适应
                this.gFirstImageLayer = gFirstImageLayer;
                this.gFirstFeatureLayer = gFirstFeatureLayer;
                this.gMap = gMap;
                window.onresize = function () {
                    gMap && gMap.resize();
                };
            },
            // 触发 工具功能 类型会自动触发工具内对应渲染的图形
        setMode: function(mode) {
                this.gMap.setMode(mode);
                //  动态颜色可以在这里赋值 精确到某一个操作
                var drawingStyle
                // 后续对应模式处理
                switch (mode) {
                    case "PAN": {
                        break;
                    }
                    case "MARKER": {
                        // 忽略
                        break;
                    }
                    case "POINT": {
                        drawingStyle = {fillStyle: "#9370DB", strokeStyle:"#f00"};
                        this.gMap.setDrawingStyle(drawingStyle);
                        break;
                    }
                    // case "CIRCLE": {
                    //     drawingStyle = {fillStyle: "#9370DB", strokeStyle: "#f00", lineWidth: 2};
                    //     this.gMap.setDrawingStyle(drawingStyle);
                    //     break;
                    // }
                    case "LINE": {
                        drawingStyle = {strokeStyle: "#FF0000", lineJoin: "round", lineCap: "round", lineWidth: 5, arrow: false};
                        this.gMap.setDrawingStyle(drawingStyle);
                        break;
                    }
                    case "POLYLINE": {
                        drawingStyle = {strokeStyle: "#FF1493", lineJoin: "round", lineCap: "round", lineWidth: 1}
                        this.gMap.setDrawingStyle(drawingStyle);
                        break;
                    }
                    case "RECT": {
                        drawingStyle = {strokeStyle: "#f00", lineWidth: 1}
                        this.gMap.setDrawingStyle(drawingStyle);
                        break;
                    }
                    case "POLYGON": {
                        drawingStyle = {strokeStyle: "#00f", fillStyle: "#0f0", globalAlpha: .3, lineWidth: 1, fill: true, stroke: true}
                        this.gMap.setDrawingStyle(drawingStyle);
                        break;
                    }
                    // case "DRAWMASK": {
                    //     drawingStyle = {strokeStyle: "rgba(255, 0, 0, .5)", fillStyle: "#00f", lineWidth: 50}
                    //     this.gMap.setDrawingStyle(drawingStyle);
                    //     break;
                    // }
                    // case "CLEARMASK": {
                    //     drawingStyle = {fillStyle: "#00f", lineWidth: 30}
                    //     this.gMap.setDrawingStyle(drawingStyle);
                    //     break;
                    // }
                    case "TEXT": {
                        drawingStyle = {fillStyle: "#00f", lineWidth: 30}
                        this.gMap.setDrawingStyle(drawingStyle);
                        break;
                    }
                    default:
                        break;
                }
        },
        switch_label_category: function(label_type, label_index, label_info){
            // if(label_type == 'RECT'){
                // 标注框过程
                var label_color = label_info['color']
                // 切换拖拽时的颜色
                var drawingStyle = {
                    strokeStyle: label_color, 
                    lineWidth: 1,

                }
                this.gMap.setDrawingStyle(drawingStyle);

                // 切换激活标注
                this.label_metas['activate_label_index'] = label_index;     
            // }
        },
        remove_annotations: function(){
            var allfeatures = this.gFirstFeatureLayer.getAllFeatures();
            for(var f in allfeatures){
                this.gFirstFeatureLayer.removeFeatureById(allfeatures[f].id);
            }
        },
        update_annotations: function(){
            var label_info_result = []

            // 实例级别标签
            var features = this.gFirstFeatureLayer.getAllFeatures();
            for(var f in features){
                if (features[f].type == 'RECT'){
                    var width = features[f].shape.width;
                    var height = features[f].shape.height;
                    var x = features[f].shape.x;
                    var y = features[f].shape.y;
                    var label = features[f].props.label
                    label_info_result.push({
                        'shape':{
                            width: width,
                            height: height,
                            x:x,
                            y:y
                        },
                        'type': 'RECT',
                        'label': label,
                    })
                }
                else if(features[f].type == 'POINT'){
                    label_info_result.push({
                        'shape':{
                            x:features[f].shape.x,
                            y:features[f].shape.y,
                            sr:features[f].shape.sr,
                        },
                        'type': 'POINT',
                        'label': features[f].props.label,
                    })
                }
                else if(features[f].type == 'POLYGON'){
                    label_info_result.push({
                        'shape':{
                            'points': features[f].shape.points
                        },
                        'type': 'POLYGON',
                        'label': features[f].props.label,
                    })
                }
            }
            
            // 图片级别标签
            if(this.choices.length > 0){
                label_info_result.push({
                    'type': 'CHOICES',
                    'label': this.choices,
                })
            }

            this.activate_sample['label_info'] = label_info_result;
            this.samples[this.activate_sample['sample_id']]['label_info'] = label_info_result;
            var _this = this;
            let params = new FormData();  
            params.append('sample', JSON.stringify(this.activate_sample))

            _this.axios.post(
                '/antgo/api/label/sample/update/', params).then(function(res){
                // 成功更新
                var update_sample_id = res.data.content['sample_id'];
                // 返回更新后的信息
                _this.samples[update_sample_id]['completed_time'] = res.data.content['completed_time'];
                _this.samples[update_sample_id]['update_time'] = res.data.content['update_time'];
                _this.samples[update_sample_id]['state'] = res.data.content['sample_state'];

                _this.activate_sample['completed_time'] = res.data.content['completed_time'];
                _this.activate_sample['update_time'] = res.data.content['update_time'];
                _this.activate_sample['state'] = res.data.content['sample_state'];

            }).catch(function(error){
                // do nothing
                console.log(error)
            })  
        },
        show_anno_info: function(sample){
            // 从后台获取标注数据
            // TODO
            // alert(sample)
        },
        start_label_sample: function(sample){
            // 设置当前激活的样本
            this.activate_sample = sample;

            // 设置当前标注图片，并清空已用数据
            this.gMap.removeLayerById(this.gFirstImageLayer.id);

            // 图片层添加
            const gFirstImageLayer = new AILabel.Layer.Image(
                "layer-image", // id
                {
                    src: sample['image_file'],
                    width: sample['width'],
                    height: sample['height'],
                    crossOrigin: false,         // 如果跨域图片，需要设置为true
                    position: {                 // 左上角相对中心点偏移量
                        x: 0,
                        y: 0
                    },
                }, // imageInfo
                {name: sample['image_file']},
                {zIndex: 5}
            );
            this.gMap.addLayer(gFirstImageLayer);
            this.gFirstImageLayer = gFirstImageLayer;

            // 重置当前状态
            this.clear_state();

            // 从后台获得当前样本历史数据 并添加初始标注结果
            var label_info = sample['label_info'];
            for(var i in label_info){
                var data = label_info[i];

                if(data['type'] == 'RECT'){
                    const rectFeature = new AILabel.Feature.Rect(
                        `${+new Date()}`,      // id
                        data['shape'],         // shape
                        {
                            name: this.label_metas['label_category'][data['label']]['class_name'],
                            label: this.label_metas['label_category'][data['label']]['class_index']
                        }, // props
                        {
                            fillStyle: "rgba(255,255,255,0.5)", 
                            strokeStyle: this.label_metas['label_category'][data['label']]['color'], 
                            lineWidth: 2,
                            fill: true,
                        } // style
                        
                    );
                    this.gFirstFeatureLayer.addFeature(rectFeature);
                }
                else if(data['type'] == 'POINT'){
                    const pointFeature = new AILabel.Feature.Point(
                        `${+new Date()}`,      // id
                        data['shape'],         // shape
                        {
                            name: this.label_metas['label_category'][data['label']]['class_name'],
                            label: this.label_metas['label_category'][data['label']]['class_index']
                        },     // props
                        {fillStyle: this.label_metas['label_category'][data['label']]['background_color']} // style
                    );
                    this.gFirstFeatureLayer.addFeature(pointFeature);
                }
                else if(data['type'] == 'POLYGON'){
                    const polygonFeature = new AILabel.Feature.Polygon(
                        `${+new Date()}`, // id
                        {points: data['shape']['points']}, // shape
                        {                                   
                            name: this.label_metas['label_category'][data['label']]['class_name'],
                            label: this.label_metas['label_category'][data['label']]['class_index']
                        }, // props
                        {
                            fillStyle: "rgba(255,255,255,0.5)", 
                            strokeStyle: this.label_metas['label_category'][data['label']]['color'], 
                            lineWidth: 2, 
                            fill: true,
                        } // style
                    );   
                    this.gFirstFeatureLayer.addFeature(polygonFeature);  
                          
                }
                else if(data['type'] == 'CHOICES'){
                    this.choices = data['choices']
                }
            }

        },
        clear_state: function(){
                // 清空当前绘图标签
                this.label_metas.activate_label_index = -1;

                // 清空图层
                var features = this.gFirstFeatureLayer.getAllFeatures();
                for(var f in features){
                    this.gFirstFeatureLayer.removeFeatureById(features[f].id)
                }

                // 重置绘图默认状态
                var drawingStyle = {strokeStyle: "#f00", lineWidth: 1}
                this.gMap.setDrawingStyle(drawingStyle);
                
                // 
                this.choices = []
        },
        next: function(){
            var _this = this;
            // next sample label
            _this.axios.get(
                '/antgo/api/label/sample/next/').then(function(res){
                if(res.data.content['stage'] == 'finish'){
                    // 跳转到项目页面
                    _this.$router.push({path: '/'})
                    return
                }

                // 1.step 开始标注指定样本
                _this.start_label_sample(res.data.content['sample'])

                // 2.step 根据当前的返回的下一个等待标注样本，
                // 以防止，左侧样本列表还不存在此样本
                if(_this.now_page * _this.page_size <= res.data.content['sample']['sample_id']){
                    // 返回从当前已经加载的样本到指定此处的偏移之间的所有样本
                    _this.axios.get(
                        '/antgo/api/label/sample/',
                        {
                            params:{
                                page_index: _this.now_page,
                                index_offset: res.data.content['sample']['sample_id'],
                                page_size: 50
                            }
                        }
                    ).then(function(res1){
                        var total_num = res1.data.content['total_sample_num'];
                        for(var i in res1.data.content['page_samples']){
                            _this.samples.push(res1.data.content['page_samples'][i])
                        }
                        if(_this.samples.length < total_num){
                            _this.more_show = true;
                        }
                        else{
                            _this.more_show = false;
                        }
                        _this.now_page = res1.data.content['page_index'];
                    }).catch(function(error){
                        // do nothing
                    })   

                }
            }).catch(function(error){
                // do nothing
                console.log(error)
            })             
        },
        select: function(sample_i){
            // alert(1)
            var _this = this;
            // next sample label
            _this.axios.get(
                '/antgo/api/label/sample/get/', {
                    params:{
                        sample_i:sample_i
                    }
                }).then(function(res){
                // 开始标注指定样本
                _this.start_label_sample(res.data.content['sample'])
                

            }).catch(function(error){
                // do nothing
                console.log(error)
            })  
        },
        scrollMore: function(index) { 
            // 滚动加载更多
            var _this = this;
            
            var params = {}
            if(index < 0){
                params = {
                    page_index: _this.now_page,
                    page_size: 50
                }
            }
            else{
                params = {
                    page_index: _this.now_page,
                    index_offset: index,
                    page_size: 50
                }
            }
            _this.axios.get(
                '/antgo/api/label/sample/',
                {
                    params: params
                }
            ).then(function(res){
                var total_num = res.data.content['total_sample_num'];
                for(var i in res.data.content['page_samples']){
                    _this.samples.push(res.data.content['page_samples'][i])
                }
                if(_this.samples.length < total_num){
                    _this.more_show = true;
                }
                else{
                    _this.more_show = false;
                }
                _this.now_page = res.data.content['page_index'];
            }).catch(function(error){
                // do nothing
            })            
        },    
        handleScroll: function(e){
            //变量scrollTop是滚动条滚动时，距离顶部的距离
            var scrollTop = e.target.scrollTop;
            //变量windowHeight是可视区的高度
            var windowHeight = e.target.clientHeight;
            //变量scrollHeight是滚动条的总高度
            var scrollHeight = e.target.scrollHeight;
            //滚动条到底部的条件
            if(scrollTop + windowHeight == scrollHeight){
                //写后台加载数据的函数
                this.scrollMore(-1)
            }
        }
    }
 }
</script>

<style>
hr {
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
.dm-table__cell {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex: 150 0 auto;
    max-width: min-content;
    min-width: min-content;
    overflow: hidden;
    padding: 5px;
    position: relative;
    width: fit-content;
    word-break: break-word;
}
.row_activate{
}
.row_activate_selected{
    background-color: #0000ff26
}
.row_activate:hover{
    background-color: #0000ff26
}
.lsf-space_direction_horizontal {
    align-items: center;
    grid-auto-flow: column;
}
.lsf-space_size_small {
    grid-gap: 8px;
}
.lsf-space {
    grid-gap: 16px;
    display: grid;
}
.lsf-userpic {
    align-items: center;
    background: #f5f5f5;
    border-radius: 13.5px;
    box-shadow: inset 0 0 0 1px rgb(0 0 0 / 10%);
    display: flex;
    height: 28px;
    justify-content: center;
    overflow: hidden;
    position: relative;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    width: 28px;
}
.lsf-userpic img {
    font-size: 12px;
    height: 100%;
    line-height: 22px;
    -o-object-fit: cover;
    object-fit: cover;
    opacity: 0;
    position: absolute;
    width: 100%;
}
.lsf-annotations-list__create, .lsf-annotations-list__entity {
    align-items: center;
    cursor: pointer;
    display: flex;
    height: 48px;
    padding: 0 16px;
}
.lsf-userpic__username {
    display: block;
    font-family: Roboto;
    font-size: 12px;
    font-weight: 700;
    line-height: 22px;
    opacity: .4;
}
.lsf-space_direction_vertical {
    grid-auto-flow: row;
    grid-auto-rows: -webkit-max-content;
    grid-auto-rows: max-content;
    justify-content: center;
}
.lsf-space_collapsed, .lsf-space_size_none {
    grid-gap: 0;
}
.lsf-annotations-list__user {
    display: flex;
    font-size: 14px;
    line-height: 16px;
    max-width: 165px;
}
.lsf-annotations-list__name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.lsf-annotations-list__entity-id {
    flex: none;
    font-size: 11px;
    opacity: .5;
    padding-left: 5px;
}
.lsf-annotations-list__created {
    color: rgba(0,0,0,.4);
    font-size: 11px;
    line-height: 13px;
}
</style>