<template>
    <b-container style="margin-top: 30px; max-width: 80%;">
	<b-row>
		<b-jumbotron :header="title" :lead="description" style="width: 100%;">
		</b-jumbotron>		
	</b-row>

    <b-row>
        <!-- left is about input content -->
        <b-col>
            <b-card class="mt-6" header="输入信息">
            <b-container>
                <b-row v-for="(input, input_i) in input_info" :key="input_i" >
                    <b-col v-if="input['type'] == 'image'" style="margin-top: 20px">                        
                        <h4><b-badge style="font-weight: 300;">{{input['name']}}</b-badge></h4>
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div v-if="input['has_interactive']" :id="input['name']" style="width: 100%; height:400px; position: relative; border-style:solid; border-width:1px"></div>
                            <b-img v-else :src="input['path']" :id="input['name']" style="max-width: 512px; border-style:solid; border-width:1px"></b-img>
                        </div>

                        <b-form-file
                            v-model="input['value']"
                            :state="Boolean(input['status'] == 'finish')"
                            placeholder="拖拽文件至此..."
                            drop-placeholder="Drop file here..."
                            accept=".jpg, .png, .jpeg"
                            browse-text="打开"
                            @input="uploadfile(input_i)">
                        </b-form-file>
                        <div class="mt-3">上传文件: {{ input['status']=='finish' ? input['value'].name + ' 完成': '' }}</div>
                    </b-col>
                    <b-col v-if="input['type'] == 'video'" style="margin-top: 20px">
                        <h5>{{input['name']}}</h5>
                        <video :src="input['path']" controls></video>
                        <b-form-file
                            v-model="input['value']"
                            :state="Boolean(input['status'] == 'finish')"
                            placeholder="拖拽文件至此..."
                            drop-placeholder="Drop file here..."
                            accept=".mp4"
                            browse-text="打开"
                            @input="uploadfile(input_i)">
                        </b-form-file>
                        <div class="mt-3">上传文件: {{ input['status']=='finish' ? input['value'].name + ' 完成' : '' }}</div>
                    </b-col>
                    <b-col v-if="input['type'] == 'text'">
                        <b-input-group :prepend="input['name']" class="mt-3">
                            <b-form-input v-model="input['value']"></b-form-input>
                        </b-input-group>
                    </b-col>
                        <b-col v-if="input['type'] == 'slider'" style="margin-top: 20px">
                    <h5>{{input['name']}} {{input['value']}}</h5>
                    <b-input-group :prepend="input['min']" :append="input['max']" class="mt-3">
                        <b-form-input type="range" v-model="input['value']" :min="input['min']" :max="input['max']"></b-form-input>
                    </b-input-group>
                    </b-col>
                    <b-col v-if="input['type'] == 'checkbox'" style="margin-top: 20px">
                        <b-form-checkbox v-model="input['value']" value=1 unchecked-value=0>{{input['name']}}</b-form-checkbox>  
                    </b-col>
                    <b-col v-if="input['type'] == 'select'" style="margin-top: 20px">
                        <h5>{{input['name']}}</h5>
                        <b-form-select v-model="input['value']" :options="input['options']"></b-form-select>
                    </b-col>
                </b-row>
            </b-container>
            </b-card>
        </b-col>

        <!-- right is about output content -->
        <b-col>
            <b-card class="mt-6" header="输出信息">
				<div v-if="iserror">
					<b-alert show>{{ error_message }}</b-alert>
				</div>
				<div v-else-if="iswaiting">
					<count-down></count-down>
				</div>
				<div v-else>
					<b-container>
					<b-row v-for="(output, output_i) in output_info" :key="output_i">
						<b-col v-if="output['type'] == 'image'">
                            <h4><b-badge style="font-weight: 300;">{{output['name']}}</b-badge></h4>
							<div style="display: flex; flex-direction: column; align-items: center;">
								<div>
									<div v-if="output['interactive']" :id="output['name']" style="width: 400px; height:400px; border-style:solid; border-width:1px"></div>
									<b-img v-else :src="output['value']" :id="output['name']" style="max-width: 512px; border-style:solid; border-width:1px"></b-img>
								</div>
							</div>
		
						</b-col>
                        <b-col v-if="output['type'] == 'video'">
                            <h3><b-badge>{{output['name']}}</b-badge></h3>
                            <video :src="output['value']" controls></video>                            
                        </b-col>

						<b-col v-if="output['type'] == 'text'">
							<b-input-group :prepend="output['name']" class="mt-3">
								<b-form-input v-model="output['value']" disabled></b-form-input>
							</b-input-group>      
						</b-col>
						<b-col v-if="output['type'] == 'number'">
							<b-input-group :prepend="output['name']" class="mt-3">
								<b-form-input type="number" v-model="output['value']" disabled></b-form-input>
							</b-input-group>                          
						</b-col>
					</b-row>
				</b-container>		
				</div>

			</b-card>
        </b-col>
    </b-row>
    <b-row style="margin-top: 50px">
        <b-button  variant="primary" style="width:100px" @click="submit()">提交</b-button>
    </b-row>
    </b-container>
</template>

<script>
import AILabel from "ailabel";
import Login from "./Login.vue";
export default{
    name: 'Demo',
    data(){
        return {
			title: '',
			demo: '', 
			description: '',
            input_info: [
                // {
                //     'type': 'text', // text, number, image, video, 
                //     'name': 'hello',
                //     'value': 'w'
                // },
                // {
                //     'type': 'image',
                //     'name': '111',
                //     'value': '',
                //     'status': 'default', // default, uploading, finish
                // },
                // {
                //     'type': 'video',        
                //     'name': '222',
                //     'value': '',            
                //     'status': 'defalut'
                // },
                // {
                //     'type': 'slider',
                //     'name': 'hello',
                //     'value': 5,
                //     'min': 1,
                //     'max': 10,
                // },
                // {
                //     'type': 'checkbox',
                //     'name': 'world',
                //     'value': 1,
                // },
                // {
                //     'type': 'select',
                //     'name': 'yyy',
                //     'value': 'B',
                //     'options': [{'value': 'A', 'text': 'xxx'}, {'value': 'B', 'text': 'yyyy'}]
                // }
            ],
            output_info: [
                // {
                //     'type': 'text', // text, number, image, video, file
                //     'name': 'hh',
                //     'value': 'bb'
                // },
                // {
                //     'type': 'number',
                //     'name': 'world',
                //     'value': 0
                // },
                // {
                //     'type': 'image',
                //     'name': '/static/1.png',
                //     'value': '/assets/1.jpeg',
				// 	'interactive': true,
                // },
            ],
			image_meta_info:{},
			iswaiting: false,
			iserror: false,
			error_message: ''
        }
    },
    mounted: function(){
		if(this.$route.params.name){
			this.demo = this.$route.params.name;
		}

        var _this = this;
        _this.axios.get('/antgo/api/demo/query_config/', {
			params:{
				'demo': _this.demo
			}
		}).then(function(res){
            _this.input_info = res.data['input']
            for(var index in _this.input_info){
                _this.input_info[index]['has_interactive'] = false;
                if(Object.keys(_this.input_info[index].interactive).length > 0){
                    _this.input_info[index]['has_interactive'] = true;
                }
            }
			_this.title = res.data['title']
			_this.description = res.data['description']
        }).catch(function(error){
            // do nothing
            console.log(error)
        })
    },
    methods:{
        uploadfile: function(input_i){
            // 1.step 修改数据状态
            this.input_info[input_i]['status'] = 'uploading'
            
            // 2.step 上传
            var form_data = new FormData();
            form_data.append("file",this.input_info[input_i].value);
            var _this = this;
            // 此时可以自行将文件上传至服务器
            _this.axios.post("/antgo/api/demo/upload/",form_data).then((res) => {
                _this.input_info[input_i]['status'] = 'finish';
                _this.input_info[input_i]['path'] = res.data['path'];
                _this.$forceUpdate();
                
				// 根据上传文件类型，进行处理
                if(_this.input_info[input_i]['type'] == 'image' && Object.keys(_this.input_info[input_i]['interactive']).length > 0){
                    // 绑定了交互能力
					_this.initMap(
                        _this.input_info[input_i]['name'],
						res.data['path'], 
						res.data['height'], 
						res.data['width']
					);
					_this.setMode(_this.input_info[input_i]['name'], _this.input_info[input_i]['interactive']['mode'], _this.input_info[input_i]['interactive']['num']);
                }
            })
        },
        submit: function(){
            this.iswaiting = true;
			this.iserror = false;
			var query_info = {
				'input': [],
				'element': [],
				'demo': this.demo
			}
            
            for(var index in this.input_info){
                if(this.input_info[index]['type'] == 'image' || this.input_info[index]['type'] == 'video'){
                    // file id
                    query_info['input'].push(this.input_info[index]['path'])
                }
                else{
                    query_info['input'].push(this.input_info[index]['value'])
                }
            }

			for(let o in Object.keys(this.image_meta_info)){
				let key = Object.keys(this.image_meta_info)[o];
				var label_info_result = []
				var features = this.image_meta_info[key]['feature_layer'].getAllFeatures();
				for(var f in features){
					if (features[f].type == 'RECT'){
						var width = features[f].shape.width;
						var height = features[f].shape.height;
						var x = features[f].shape.x;
						var y = features[f].shape.y;
						label_info_result.push({
							'data': [x,y,x+width,y+height],
							'type': 'RECT',
						})
					}
					else if(features[f].type == 'POINT'){
						label_info_result.push({
							'data': [features[f].shape.x,features[f].shape.y],
							'type': 'POINT',
						})
					}
					else if(features[f].type == 'POLYGON'){
						var polygon_points = [];
						for(var point_i in features[f].shape.points){
							polygon_points.push(
								[features[f].shape.points[point_i].x, features[f].shape.points[point_i].y]
							)
						}

						label_info_result.push({
							'data': polygon_points,
							'type': 'POLYGON',
						})
					}
					else if(features[f].type == 'LINE'){
						label_info_result.push({
							'data':[
								[features[f]['shape']['start'].x, features[f]['shape']['start'].y],
								[features[f]['shape']['end'].x, features[f]['shape']['end'].y]],
							'type': 'LINE',
						})
					}
				}

				query_info['element'].push({
					'name': key,								// 绑定的图像ID
					'value': label_info_result,					// 交互数据
					'mode': this.image_meta_info[key]['mode']	// 交互模式
				})
			}

            var _this = this;
            let params = new FormData();  
            params.append('query', JSON.stringify(query_info))

            _this.axios.post(
                '/antgo/api/demo/submit/',
                params
            ).then(function(res){
				// 如果请求中，包含交互元素；则判断是否已经创建对应图像是否绑定交互
				_this.output_info = res.data;			
				_this.iswaiting = false;
				_this.$nextTick(()=>{
					for(let index in res.data){
						var name = res.data[index]['name'];
						if(res.data[index]['type'] == 'image'){
							if(!(name in _this.image_meta_info) && res.data[index]['interactive']){
								// 绑定交互功能 (新创建)
								_this.initMap(
									res.data[index]['name'], 
									res.data[index]['value'], 
									res.data[index]['height'], 
									res.data[index]['width']
								);
								_this.setMode(res.data[index]['name'], res.data[index]['element']['mode'], res.data[index]['element']['num']);
							}
							else if((name in _this.image_meta_info) && res.data[index]['interactive']){
								var existed_features = _this.image_meta_info[name]['feature_layer'].getAllFeatures();
								_this.initMap(
									res.data[index]['name'], 
									res.data[index]['value'], 
									res.data[index]['height'], 
									res.data[index]['width']
								);
								_this.setMode(res.data[index]['name'], res.data[index]['element']['mode'], res.data[index]['element']['num']);
								for(var i in existed_features){
									_this.image_meta_info[name]['feature_layer'].addFeature(existed_features[i]);
								}
							}
						}
					}
				});
            }).catch(function(error) {
				_this.iserror = true;
				_this.error_message = '['+error.response.status.toString()+']:'+error.response.data.detail
			}).finally(function() {
			});
        },
		initMap: function(image_name, image_src, height, width){
			var _this = this;
            // npm i ailabel
			const gMap = new AILabel.Map(image_name, {
				center: {x: 100, y: 100}, 		// 为了让图片居中
				zoom: 1000,
				mode: "ban", 					// PAN 可以平移和放大缩小   ban  可以平移 
				refreshDelayWhenZooming: true, 	// 缩放时是否允许刷新延时，性能更优
				zoomWhenDrawing: true,
				panWhenDrawing: false,
				zoomWheelRatio: 5,      		// 控制滑轮缩放缩率[0, 10), 值越小，则缩放越快，反之越慢
				withHotKeys: false       		// 关闭快捷键
			});

			// 图片层添加
			const gFirstImageLayer = new AILabel.Layer.Image(
				"layer-image", // id
				{
					src: image_src,
					width: width,
					height: height,
					crossOrigin: false, // 如果跨域图片，需要设置为true
					position: { // 左上角相对中心点偏移量
						x: 0,
						y: 0
					},
				}, // imageInfo
				{name: "图像层"}, // props
				{zIndex: 5} // 这里写样式 层级
			);

			// click单击事件 这里可以直接修改单击触发 比如如果没触发可以直接把事件放进来写成单击一个点渲染
			gMap.events.on("click", point => {
				console.log("--click--", point);
			});
			gMap.events.on("drawDone", (type, data, data1) => {
				// 限制绘制个数
				if(_this.image_meta_info[image_name]['feature_layer'].features.length >= _this.image_meta_info[image_name]['num']){
					return;
				}
				if (type === "POINT") {
					data['sr'] = 5;
					const pointFeature = new AILabel.Feature.Point(
						`${+new Date()}`, // id
						data, // shape
						{
							name: "point", 
						}, // prop
						{
							fillStyle: "#3CB371", 
						} // style
					);
					_this.image_meta_info[image_name]['feature_layer'].addFeature(pointFeature);
				}
				else if (type === "LINE") {
					const scale = gMap.getScale();
					const width = 1 / scale;
					const lineFeature = new AILabel.Feature.Line(
						`${+new Date()}`, // id
						{...data, width}, // shape
						{name: "line"}, // props
						{
							fillStyle: "rgba(255,255,255,0.5)", 
							strokeStyle: "#3CB371", 
							lineWidth: 2,
							fill: true,
						} // style
					);
					_this.image_meta_info[image_name]['feature_layer'].addFeature(lineFeature);
				}
				else if (type === "RECT") {
					const rectFeature = new AILabel.Feature.Rect(
						`${+new Date()}`,      // id
						data,                  // shape
						{
							name: "rect", 
						},     // props
						{
							fillStyle: "rgba(255,255,255,0.5)", 
							strokeStyle: "#3CB371", 
							lineWidth: 2,
							fill: true,
						} // style
					);
					_this.image_meta_info[image_name]['feature_layer'].addFeature(rectFeature);
				}
				else if (type === "POLYGON") {
					const polygonFeature = new AILabel.Feature.Polygon(
						`${+new Date()}`, // id
						{points: data}, // shape
						{                                   
							name: "polygon", 
						}, // props
						{
							fillStyle: "rgba(255,255,255,0.5)",
							strokeStyle: "#3CB371", 
							lineWidth: 2, 
							fill: true,
						} // style
					);         
					_this.image_meta_info[image_name]['feature_layer'].addFeature(polygonFeature);
				}
			});
			// 视野范围发生变化
			gMap.events.on("boundsChanged", data => {
				console.log("--map boundsChanged--");
			});
			// 在绘制模式下双击feature触发选中
			gMap.events.on("featureSelected", feature => {
				// 双击触发删除
				_this.image_meta_info[image_name]['feature_layer'].removeFeatureById(feature.id)
			});
			gMap.events.on("featureUnselected", () => {
				// 取消featureSelected
				gMap.setActiveFeature(null);
			});
			gMap.events.on("featureUpdated", (feature, shape) => {
				console.log('feature updated')
			});
			gMap.events.on("featureDeleted", ({id: featureId}) => {
				console.log('feature delete')
			});     
            
			// 添加到gMap对象
			gMap.addLayer(gFirstImageLayer);

			const gFirstFeatureLayer = new AILabel.Layer.Feature(
				"first-layer-feature", // id
				{name: "绘制层"}, // props
				{zIndex: 10} // style
			);
			gMap.addLayer(gFirstFeatureLayer);

			_this.image_meta_info[image_name] = {}
			_this.image_meta_info[image_name]['gmap'] = gMap;
			_this.image_meta_info[image_name]['image_layer'] = gFirstImageLayer;
			_this.image_meta_info[image_name]['feature_layer'] = gFirstFeatureLayer;
			_this.image_meta_info[image_name]['mode'] = ''
		},
		setMode: function(image_name, mode, num) {
                this.image_meta_info[image_name]['gmap'].setMode(mode);
				this.image_meta_info[image_name]['mode'] = mode;
				this.image_meta_info[image_name]['num'] = num;

                // 后续对应模式处理
				var drawingStyle;
                switch (mode) {
                    case "POINT": {
                        drawingStyle = {fillStyle: "#9370DB", strokeStyle:"#f00"};
                        this.image_meta_info[image_name]['gmap'].setDrawingStyle(drawingStyle);
                        break;
                    }
                    case "LINE": {
                        drawingStyle = {strokeStyle: "#FF0000", lineJoin: "round", lineCap: "round", lineWidth: 5, arrow: false};
                        this.image_meta_info[image_name]['gmap'].setDrawingStyle(drawingStyle);
                        break;
                    }
                    case "POLYLINE": {
                        drawingStyle = {strokeStyle: "#FF1493", lineJoin: "round", lineCap: "round", lineWidth: 1}
                        this.image_meta_info[image_name]['gmap'].setDrawingStyle(drawingStyle);
                        break;
                    }
                    case "RECT": {
                        drawingStyle = {strokeStyle: "#f00", lineWidth: 1}
                        this.image_meta_info[image_name]['gmap'].setDrawingStyle(drawingStyle);
                        break;
                    }
                    case "POLYGON": {
                        drawingStyle = {strokeStyle: "#00f", fillStyle: "#0f0", globalAlpha: .3, lineWidth: 1, fill: true, stroke: true}
                        this.image_meta_info[image_name]['gmap'].setDrawingStyle(drawingStyle);
                        break;
                    }
                    case "TEXT": {
                        drawingStyle = {fillStyle: "#00f", lineWidth: 30}
                        this.image_meta_info[image_name]['gmap'].setDrawingStyle(drawingStyle);
                        break;
                    }
                    default:
                        break;
                }
        },
    }
}
</script>

<style scoped>
@keyframes count {
    to {
        --t: 300
    }
}
@keyframes shark {
    0%{
        opacity: 1;
        transform: scale(1);
    }
    
    50%{
        opacity: 0;
        transform: scale(0.4);
    }
}
@property --t { 
    syntax: '<integer>';
    inherits: false;
    initial-value: 0;
}
count-down::after{
    --t: 0;
    counter-reset: time var(--t);
    content: counter(time) 's';
    animation: count 300s steps(300) forwards, shark 1s 300;
	/* animation: count 300s forwards; */
}
count-down{
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Consolas, Monaco, monospace;
    font-size: 120px;
}
</style>