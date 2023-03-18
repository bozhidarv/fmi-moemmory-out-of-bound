import Phaser from "phaser";
import { SmallMonster } from "~/Monsters/SmallMonster";
import { Player } from "~/players/player";
import { Health } from "~/players/health";
import { SceneMonstersConfigT, Sprite } from "~/services/type";
import { BigMonster } from "~/Monsters/BigMonster";

const monsterConfig: SceneMonstersConfigT = {
  smallMonsters: [
    {
      startX: 300,
      startY: 100,
    },
    {
      startX: 400,
      startY: 500,
    },
    {
      startX: 500,
      startY: 600,
    },
    {
      startX: 600,
      startY: 700,
    },
  ],
  bigMonsters: [
    {
      startX: 500,
      startY: 100,
    },
  ],
};
export default class MainScene extends Phaser.Scene {
  monsters: (SmallMonster | BigMonster)[] = [];
  player: Player = {} as Player;
  monsterSprites: Sprite[] = [];
  lastBulletsCount = 0;

  preload() {
    this.load.image("background", "assets/corridor.png");
    this.load.image("small-monster", "assets/small-ram-monster-64.png");
    this.load.image("big-monster", "assets/big-ram-monster.png");
    this.load.image("enemy-sign--", "assets/enemy-sign-minus.png");
    this.load.image("enemy-sign-+", "assets/enemy-sign-plus.png");
    this.load.image("enemy-sign-*", "assets/enemy-sign-multiply.png");
    this.load.image("bullet", "assets/bullet.png");
    for (let index = 0; index <= 9; index++) {
      this.load.image(
        `enemy-digit-${index}`,
        `assets/enemy-digit-${index}.png`
      );
    }
    this.load.image("health", "assets/health.png");
  }

  create() {
  
    // const invisWall =this.physics.add.sprite(64,window.innerHeight-50,"invisWall");
    // invisWall.setVisible(false);
    // invisWall.setImmovable(true);
    // invisWall.setSize (0,window.innerHeight);
    // invisWall.scaleX=2;
    // invisWall.scaleY=30;
    
    const background = this.add.image(1920 / 2, 960 / 2, "background");
    background.displayHeight = window.innerHeight;
    background.displayWidth = window.innerHeight;
    background.scale = 1;

    this.player = new Player(500, 100, this);
   // this.physics.add.collider(invisWall,this.player.sprite);

    this.generateMonsters();

    //this.health.loseHealth();
  }

  generateMonsters() {
    this.monsters = this.monsters.concat(
      monsterConfig.smallMonsters.map(
        (monster, index) =>
          new SmallMonster(monster.startX, monster.startY, index, this)
      )
    );

    this.monsters = this.monsters.concat(
      monsterConfig.bigMonsters.map(
        (monster, index) =>
          new BigMonster(monster.startX, monster.startY, index, this)
      )
    );

    this.monsterSprites = this.monsters.map(
      (monster) => monster.body.mainSprite
    );

    this.physics.add.collider(this.monsterSprites, this.monsterSprites);

    this.physics.add.collider(
      this.monsterSprites,
      this.player.sprite,
      (obj) => {
        const monsterIndex = this.monsters.findIndex(
          (monster) => monster.body.mainSprite.name === obj.name
        );
        this.monsters[monsterIndex].destroy();
        this.monsters.splice(monsterIndex, 1);

        this.player.hit();
      }
    );
  }

  update(time, delta) {
    this.player.update();

    if (this.player.bullets.length < this.lastBulletsCount) {
      this.lastBulletsCount--;
    }

    if (this.player.bullets.length > this.lastBulletsCount) {
      this.physics.add.collider(
        this.monsterSprites,
        this.player.bullets[this.player.bullets.length - 1],
        (hitMonster, hitBullet) => {
          const monsterIndex = this.monsters.findIndex(
            (monster) => monster.body.mainSprite.name === hitMonster.name
          );
          const isAlive = this.monsters[monsterIndex].hit(
            parseInt(hitBullet.name.split(";")[1])
          );
          if (!isAlive) {
            this.monsters.splice(monsterIndex, 1);
          }
          const hitBulletIndex = this.player.bullets.findIndex(
            (bullet) => bullet.name === hitBullet.name
          );
          hitBullet.destroy();
          this.player.bullets.splice(hitBulletIndex, 1);
        }
      );
    }

    this.monsters.forEach((monster) => {
      monster.move(this.player, this);
    });
  }
}
