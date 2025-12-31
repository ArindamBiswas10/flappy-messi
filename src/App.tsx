import {useState, useEffect, useRef} from 'react';

interface Pipe{
  x: number;
  gapY: number;
  score: boolean;
}

interface Player{
  y: number;
  velocity: number;
}

interface GameState{
  started: boolean;
  over: boolean;
  score: number;
  player: Player;
  pipes: Pipe[];
  framecount: number;
}

type GameStatus = 'start'| 'playing' | 'gameover';

//main app component

const FlappyBirdApp: React.FC = () => {

  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const gameStateRef = useRef<GameState>({
    started : false,
    over : false,
    score : 0,
    player : {
      y : 250,
      velocity : 0
    },
    pipes : [],
    framecount : 0
  });

  const [displayScore, setDisplayScore] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('start');


  //Refs
  const bgGameRef = useRef<HTMLAudioElement|null>(null);
  const gameOverBgmRef = useRef<HTMLAudioElement|null>(null);
  const animationFrameRef = useRef<number|null>(null);

  //messi images ref
  const messiNormalImg = useRef<HTMLImageElement|null>(null);
  const messiHitImg = useRef<HTMLImageElement|null>(null);


  const [isHit, setIsHit] = useState<boolean>(false);

  //Game constants
  const GRAVITY = 0.5;
  const JUMP = -8;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 180;
  const PIPE_SPEED = 3;
  const MESSI_SIZE = 40;
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 600;

  //Load Image when mounts first time
  useEffect(() => {
    const messiNormal = new Image();
    messiNormal.onload = () => {
      messiNormalImg.current = messiNormal;
    }
    messiNormal.src = '../assets/messiimg.png';

    const messiHit = new Image();
    messiHit.onload = () => {
      messiHitImg.current = messiHit;
    }
  
  } ,[])

  //main game loop
  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;

    const ctx = canvas.getContext('2d');
    if(!ctx) return;

    const render = () : void => {
      const state = gameStateRef.current;

      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

      ctx.fillStyle = '#8B4513';
      ctx.fillRect(0, CANVAS_HEIGHT -50, CANVAS_WIDTH, 50);
       
      //Game Physics
      if(state.started && !state.over){

        state.player.velocity += GRAVITY;

        state.player.y += state.player.velocity;

        //moving pipes to left
        state.pipes = state.pipes.map((pipe:Pipe) => 
          ({
            ...pipe,
            x: pipe.x - PIPE_SPEED
          }))
          .filter((pipe: Pipe) =>  pipe.x > -PIPE_WIDTH);// Remove off screen pipes

          state.framecount++;
          const lastPipe = state.pipes[state.pipes.length -1];

          if(!lastPipe || lastPipe.x < CANVAS_WIDTH - 200){
            const newPipe: Pipe = {
              x: CANVAS_WIDTH,
              gapY: Math.random() * 200 + 100,
              score: false
            };
            state.pipes.push(newPipe);
          }
          
          state.pipes.forEach((pipe: Pipe) => {
            //Did pipe just passed player x position
            const justPassed = pipe.x + PIPE_WIDTH < 100 && pipe.score + PIPE_WIDTH > 100 - PIPE_WIDTH;
            if(justPassed && !pipe.score){
              pipe.score = true;
              state.score++;
              setDisplayScore(state.score);
            }
          });

          if (checkCollision(state)) {
          setIsHit(true); // Show sad Messi IMMEDIATELY when hit
          
          // Stop background music IMMEDIATELY
          if (bgMusicRef.current) {
            bgMusicRef.current.pause();
            bgMusicRef.current.currentTime = 0;
          }
          
          // Play game over sound IMMEDIATELY
          if (gameOverSoundRef.current) {
            gameOverSoundRef.current.play().catch(err => {
              console.log('Game over sound play failed:', err);
            });
          }
          
          endGame();
          return; // Stop rendering if game is over
        }
      }


      // ===== STEP 3: Draw pipes =====
      ctx.fillStyle = '#228B22'; // Green color
      ctx.strokeStyle = '#1a6b1a'; // Dark green for outline
      ctx.lineWidth = 3;
      
      state.pipes.forEach((pipe: Pipe) => {
        // Draw top pipe
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY);
        ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY);
        
        // Draw bottom pipe
        const bottomPipeY = pipe.gapY + PIPE_GAP;
        const bottomPipeHeight = CANVAS_HEIGHT - bottomPipeY;
        ctx.fillRect(pipe.x, bottomPipeY, PIPE_WIDTH, bottomPipeHeight);
        ctx.strokeRect(pipe.x, bottomPipeY, PIPE_WIDTH, bottomPipeHeight);
        
        // Draw pipe caps (the wider parts at top/bottom for 3D effect)
        ctx.fillStyle = '#2a9d2a';
        ctx.fillRect(pipe.x - 5, pipe.gapY - 20, PIPE_WIDTH + 10, 20);
        ctx.fillRect(pipe.x - 5, bottomPipeY, PIPE_WIDTH + 10, 20);
        ctx.fillStyle = '#228B22'; // Reset color
      });


      }

      

      


    }
  })

}