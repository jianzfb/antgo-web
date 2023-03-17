<template>
    <b-container style="margin-top:30px">
        <b-container >
            <b-progress v-if="samples_num > 0" :value="index+1" :max="samples_num" show-progress animated></b-progress>
        </b-container>
        <b-badge href="#" variant="secondary">索引 {{index}}/{{ samples_num }}</b-badge>

    <b-container> 
        <b-row style="margin-bottom: 20px">
            <b-col v-for="(sample, sample_i) in samples" :key="sample_i" style="display: flex;justify-content: center;">
                <h5> 名称：{{sample['title']}}</h5>
            </b-col>
        </b-row>
        <b-row>
            <b-col v-for="(sample, sample_i) in samples" :key="sample_i" style="display: flex;justify-content: center;">
                <div v-if="sample['type'] == 'IMAGE'" style="width: 800px; height: 100%">
                    <canvas :id="'canvas_'+sample_i" style="width: auto;height:auto; max-width:100%;max-height:100%;"></canvas>
                </div>
                <div v-else>
                    {{sample['data']}}
                </div>
            </b-col>
        </b-row>
        <b-row v-if="tags.length > 0">
            <b-col v-for="(sample, sample_i) in samples" :key="sample_i" style="display: flex;justify-content: center;">
                <b-form-group>
                <b-form-checkbox-group v-model="sample['tag']">
                    <b-form-checkbox :value="tag" v-for="(tag, tag_i) in tags" :key="tag_i">{{tag}}</b-form-checkbox>
                </b-form-checkbox-group>
                </b-form-group>
            </b-col>
        </b-row>
        
        <b-row style="margin-top:10px; display: flex; flex-wrap: nowrap; justify-content: center; flex-direction: row; align-items: center;">
            <b-button-group>
            <b-button class="btn btn-default" @click="prev()">上一个</b-button>
            <b-button class="btn btn-default" @click="next()">下一个</b-button>
            <b-button class="btn btn-default" @click="randomone()">随机</b-button>
     
        </b-button-group>     
        </b-row>

    </b-container>

    <b-container style="margin-top:10px; display: flex; flex-wrap: nowrap; justify-content: center; flex-direction: row; align-items: center;">

    </b-container>


    </b-container>
</template>

<script>
export default{
    name: 'Browser',
    data(){
        return {
            samples_num: 0,
            index: 0,
            samples:[],
            tags:[],
            color_map: ['#00BFFF', '#00F5FF', '#7FFFD4', '#54FF9F', '#00FF00', '#FFF68F', '#FFFFE0', '#FFFF00', '#FFD700', '#FFC1C1']
        }
    },
    mounted: function(){
        var _this = this;
        this.$route.query.input
        _this.axios.get('/antgo/api/browser/sample/entry/',  {params:{
            input: this.$route.query.input,
            }}).then(function(res){
            _this.samples = res.data.content['value'];
            _this.index = res.data.content['step'];
            _this.tags = res.data.content['tags'];
            _this.samples_num = res.data.content['samples_num'];

            _this.freshsamples()
        }).catch(function(error){
            // do nothing
            console.log(error)
            _this.index = -1;
        })
    },
    methods:{
        prev: function(){
            var _this = this;
            _this.axios.get('/antgo/api/browser/sample/prev/', {
                params:{
                    'step': _this.index,
                    'data': JSON.stringify(_this.samples)           
                }
            }).then(function(res){
                _this.samples = res.data.content['value'];
                _this.index = res.data.content['step'];
                _this.tags = res.data.content['tags']
                _this.freshsamples()
            }).catch(function(error){
                // do nothing
                console.log(error)
            })
        },
        next: function(){
            var _this = this;
            _this.axios.get('/antgo/api/browser/sample/next/', {
                params:{
                    'step': _this.index,
                    'data': JSON.stringify(_this.samples)
                }
            }).then(function(res){
                _this.samples = res.data.content['value'];
                _this.index = res.data.content['step'];
                _this.tags = res.data.content['tags']
                _this.freshsamples()
            }).catch(function(error){
                // do nothing
                console.log(error)
            })
        },
        randomone: function(){
            var _this = this;
            _this.axios.get('/antgo/api/browser/sample/random/', {
                params:{
                    'step': _this.index,
                    'data': JSON.stringify(_this.samples)
                }
            }).then(function(res){
                _this.samples = res.data.content['value'];
                _this.index = res.data.content['step'];
                _this.tags = res.data.content['tags']
                _this.freshsamples()
            }).catch(function(error){
                // do nothing
                console.log(error)
            })
        },
        freshsamples: function(){
            this.$nextTick(() => {
                // 为每个需要进行图片展示的样本创建canvas
                var _this = this;
                for(var index in _this.samples){
                    if(_this.samples[index]['type'] == 'IMAGE'){
                        var canvas = document.getElementById('canvas_'+index);
                        var context = canvas.getContext('2d')

                        var img = new Image()
                        img.src = this.samples[index]['data']
                        // img.src = 'https://img2.baidu.com/it/u=3202947311,1179654885&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500'
                        img.onload = function(){
                            if(img.complete){
                                // 根据图像重新设定了canvas的长宽
                                canvas.setAttribute("width", img.width)
                                canvas.setAttribute("height", img.height)
                                // 绘制图片
                                context.drawImage(img,0,0,img.width,img.height)
                                
                                // 绘制矩形框
                                if('bboxes' in _this.samples[index]){
                                    // 绘制矩形框信息     
                                    if('labels' in _this.samples[index] && _this.samples[index]['labels'].length > 0){
                                        // 根据类别 设置不同颜色
                                        for(var box_t_i in _this.samples[index]['bboxes']){
                                            var box_t_xyxy = _this.samples[index]['bboxes'][box_t_i];
                                            var box_label = _this.samples[index]['labels'][box_t_i];
                                            box_label = parseInt(box_label);
                                            var t_color = _this.color_map[box_label];

                                            _this.drawRectWithText(context, box_t_xyxy[0],box_t_xyxy[1],box_t_xyxy[2]-box_t_xyxy[0],box_t_xyxy[3]-box_t_xyxy[1], t_color, box_label)
                                        }
                                    }
                                    else{
                                        // 使用统一颜色
                                        for(var box_i in _this.samples[index]['bboxes']){
                                            var box_xyxy = _this.samples[index]['bboxes'][box_i];
                                            var color = _this.color_map[0];
                                            _this.drawRect(context, box_xyxy[0],box_xyxy[1],box_xyxy[2]-box_xyxy[0],box_xyxy[3]-box_xyxy[1],color)
                                        }                                        
                                    }
                                }
                                
                                // 绘制多边形
                                if('segments' in _this.samples[index]){
                                    // 绘制多边形信息     
                                    if('labels' in _this.samples[index] && _this.samples[index]['labels'].length > 0){
                                        // 根据类别 设置不同颜色
                                        for(var seg_t_i in _this.samples[index]['segments']){
                                            var seg_t_points = _this.samples[index]['segments'][seg_t_i];
                                            var seg_t_label = _this.samples[index]['labels'][seg_t_i];
                                            seg_t_label = parseInt(seg_t_label);
                                            var seg_t_color = _this.color_map[seg_t_label];

                                            _this.drawSegment(context, seg_t_points, seg_t_color, seg_t_label);
                                        }
                                    }
                                    else{
                                        // 使用统一颜色
                                        for(var seg_i in _this.samples[index]['segments']){
                                            var seg_points = _this.samples[index]['segments'][seg_i];
                                            var seg_color = _this.color_map[0];
                                            _this.drawSegment(context, seg_points, seg_color, '');
                                        }                                        
                                    }
                                }
                                
                                // 绘制2D线或点
                                if('joints2d' in _this.samples[index]){
                                    // 3d 点也会转换成2d进入这里进行绘制
                                    // skeleton,joints2d
                                    if('skeleton' in _this.samples[index]){
                                        // 使用skeleton绘制线
                                        var bone_num = _this.samples[index]['skeleton'].length
                                        var bone_colors = []
                                        for(var bone_i in _this.samples[index]['skeleton']){
                                            bone_i = bone_i % _this.color_map.length;
                                            bone_colors.push(_this.color_map[bone_i])
                                        }

                                        _this.drawSkeleton(context, _this.samples[index]['joints2d'], _this.samples[index]['skeleton'], bone_colors)
                                    }
                                    else{
                                        // 绘制点
                                        _this.drawPoint(context, _this.samples[index]['joints2d'])
                                    }
                                }
                            }
                        }
                    }
                }
            })
        },
        drawRect: function(context, x, y, lineW, lineY, color) {
            context.beginPath();
            context.strokeStyle = color;
            context.lineWidth = 4;
            context.strokeRect(x, y, lineW, lineY);

            context.fillStyle = "rgba(255,255,255,0.5)";
            context.fillRect(x, y, lineW, lineY);
        },        
        drawRectWithText: function(context, x,y,lineW,lineY, color, text){
            this.drawRect(context, x,y,lineW,lineY, color);
            
            // 绘制文本
            context.fillStyle = color
            context.font = '20px Georgia'
            if(y <= 10){
                context.fillText(text, x+10, y+10)
            }
            else{
                context.fillText(text, x+10, y-10)
            }
        },
        drawSegment: function(context, points, color, text){
            context.beginPath();
            for(var i=0; i<points.length; ++i){
                context.lineTo(points[i][0], points[i][1]);//绘制路径
            }
            
            var cx = 0;
            var cy = 0;
            for(var j=0; j<points.length; ++j){
                cx += points[j][0];
                cy += points[j][1];
            }
            cx = cx/points.length;
            cy = cy/points.length;
            context.font = '20px Georgia'
            context.fillText(text, cx, cy)

            context.closePath();//闭合路径，也可在for循环中多一次循环lineTo()至起点
            context.strokeStyle = color;
            context.lineWidth = 4;
            context.stroke()
            context.fillStyle = "rgba(255,255,255,0.5)";
            context.fill()
        },
        
        drawSkeleton: function(context, points, skeleton, colors){
            for(var bone_i=0; bone_i<skeleton.length; ++bone_i){
                var bone_from_i = skeleton[bone_i][0];
                var bone_to_j = skeleton[bone_i][1];

                var bone_from_x = points[bone_from_i][0];
                var bone_from_y = points[bone_from_i][1];
                var bone_to_x = points[bone_to_j][0];
                var bone_to_y = points[bone_to_j][1];           
                
                var bone_color = colors[bone_i];
                
                context.beginPath();
                context.moveTo(bone_from_x, bone_from_y);
                context.lineTo(bone_to_x, bone_to_y);
                context.closePath();
                context.strokeStyle = bone_color;
                context.lineWidth = 4;
                
                context.stroke()
            }
        },

        drawPoint: function(context, points){
            for(var point_i=0; point_i<points.length; ++point_i){
                var p_x = points[point_i][0];
                var p_y = points[point_i][1];
                context.beginPath();
                context.fillStyle = 'red';
                context.arc(p_x,p_y,4,2*Math.PI,true);
                context.closePath();
                context.fill();
            }
        }
    }
}
</script>

<style scoped>
</style>