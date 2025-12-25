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
  const MESSI_SIZE = 40;
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 600;

  //Load Image when mounts first time
  useEffect(()=>{
    const img = new Image();
    img.onload = () => {
      messiImgRef.current = img;
    };
    img.src = '../assets/messiimg.png';
  }, []);

  //main game loop
  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;

    const ctx = canvas.getContext('2d');
    if(!ctx) return;

    const render = () : void => {
      const state = gameStateRef.current;

      ctx.fillStyle = 'Blue';
      ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);


    }
  })

}