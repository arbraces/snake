//游戏画布
let canvas = document.querySelector('#canvas')
ctx = canvas.getContext('2d')

//当前游戏状态
let gameState = false
//当前方向
let direction = "ArrowRight"
//游戏开始定时器
let gameInterval;

//暂停游戏
function stopGame(){
	clearInterval(gameInterval)
	gameInterval = null
}

//开始游戏
function startGame(){
	gameInterval = setInterval(function(){
		if(snake.snakeState){
			snake.move(direction)
		}else{
			gameOver()
			stopGame()
		}
	}, 100)
}

//游戏结束
function gameOver(){
	//清空画布后修改游戏状态
	alert(`游戏结束, 你的得分: ${snake.location.length-3}`)
	rebuildGame()
}

//重设游戏状态
function rebuildGame(){
	snake.emptyCanvas()
	snake = new Snake(ctx)
	gameState = false
	direction = "ArrowRight"
}

//蛇
class Snake{
	//蛇移动
	move = (direction)=>{
		//上
		if(direction == "ArrowUp"){
			//判断是否是相反的方向
			if(this.direction == "ArrowDown"){
				this.move(this.direction)
				return
			}
			this.location.push( 
			{
				x: this.location[this.location.length-1].x,
				y: this.location[this.location.length-1].y-10
			})
		//下
		}else if(direction == "ArrowDown"){
			//判断是否是相反的反向
			if(this.direction == "ArrowUp"){
				this.move(this.direction)
				return
			}
			this.location.push(
			{
				x: this.location[this.location.length-1].x,
				y: this.location[this.location.length-1].y+10
			})
		//左
		}else if(direction == "ArrowLeft"){
			//判断是否是相反的反向
			if(this.direction == "ArrowRight"){
				this.move(this.direction)
				return
			}
			this.location.push(
			{
				x: this.location[this.location.length-1].x-10,
				y: this.location[this.location.length-1].y
			})
		//右
		}else if(direction == "ArrowRight"){
			//判断是否是相反的反向
			if(this.direction == "ArrowLeft"){
				this.move(this.direction)
				return
			}
			this.location.push(
			{
				x: this.location[this.location.length-1].x+10,
				y: this.location[this.location.length-1].y
			})
		}
		this.direction = direction
		//判断是否吃到食物
		if(this.ifEatfood(this.location[this.location.length-1], this.foodDirection)){
			this.location.unshift(this.location[0])
			this.randomFood()
		}
		//清除蛇尾
		this.canvas.clearRect(this.location[0].x-1, this.location[0].y-1, 12, 12)
		//删除蛇尾
		this.location.shift()
		//生成蛇
		this.render()
		//判断是否死亡
		this.ifDeath(this.location[this.location.length-1])
	}
	
	//渲染蛇
	render = ()=>{
		this.location.forEach((item,index) => {
			this.canvas.fillRect(item.x, item.y, 10, 10)
			this.canvas.strokeRect(item.x, item.y, 10, 10);
		})
	}
	
	//随机生成食物
	randomFood = ()=>{
		let x = (Math.floor(Math.random()*45)+2)*10
		let y = (Math.floor(Math.random()*45)+2)*10
		let isRepeat = false
		//判断随机的结果是否是蛇的位置，如果是蛇的位置就在随机一遍
		this.location.forEach((item, index)=>{
			if(item.x == x || item.y == y){
				isRepeat = true
			}
		})
		//判断是否重复
		if(!isRepeat){
			this.canvas.beginPath()
			this.canvas.arc(x+5, y+5, 4, 0, Math.PI*2, true)
			this.canvas.fill();
			this.foodDirection = {x,y}
		}else{
			this.randomFood()
		}
	}
	
	//判断是否吃到食物(传蛇头的位置和食物的位置)
	ifEatfood(snakeLocation, foodLocation){
		if(snakeLocation.x == foodLocation.x && snakeLocation.y == foodLocation.y){
			return true
		}else{
			return false
		}
		
	}
	
	//清空画布
	emptyCanvas(){
		this.canvas.clearRect(0, 0, 500, 500)
	}
	
	//判断是否死亡
	ifDeath(snakeLocation){
		if(snakeLocation.x == -10 || snakeLocation.x == 500 || snakeLocation.y == -10 || snakeLocation.y == 500){
			this.snakeState = false
			return true
		}else{
			for(let i = this.location.length-2; i >= 0; i--){
				if(this.location[i].x == this.location[this.location.length-1].x && this.location[i].y == this.location[this.location.length-1].y){
					this.snakeState = false
					return true
				}
			}
			return false
		}
	}
	
	//构造函数
	constructor(canvas){
		this.canvas = canvas
		
		//蛇的颜色和边框颜色
		this.canvas.strokeStyle = "rgb(175, 37, 193)";
		this.canvas.fillStyle = "rgb(255, 255, 255)"
		this.canvas.lineWidth = 1;
		
		//蛇现在的位置
		this.location = [{x: 10, y: 10},{x: 20, y: 10},{x: 30, y: 10}]
		
		//蛇的方向
		this.direction = "ArrowRight"
		
		//食物的位置
		this.foodDirection = {x: 0, y: 0}
		
		//蛇的状态
		this.snakeState = true
		
		//初始化蛇
		this.render()
		//随机生成食物
		this.randomFood()
	}
}

//new 一个蛇
let snake = new Snake(ctx)


//监听键盘事件
document.onkeydown = function(event){
	//上下左右
	if(event.key == "ArrowUp" || event.key == "ArrowDown" || event.key == "ArrowLeft" || event.key == "ArrowRight"){
		direction = event.key
	}else if(event.code == "Space"){
		gameState = !gameState
		if(gameState){
			//开始游戏
			startGame()
		}else{
			//暂停游戏
			stopGame()
		}
	}
}
