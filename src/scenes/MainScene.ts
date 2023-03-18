import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene
{
	constructor()
	{
		super('hello-world')
	}

	preload()
    {
        this.load.image('background', 'assets/basic_background.png')
        this.load.image('logo', 'http://labs.phaser.io/assets/sprites/phaser3-logo.png')
    }

    create()
    {
        const background = this.add.image(0, 0, 'background')
        background.displayHeight = this.game.canvas.height*2;
        background.displayWidth = this.game.canvas.width*2;

        const logo = this.physics.add.image(400, 100, 'logo')

        logo.setVelocity(100, 200)
        logo.setBounce(1, 1)
        logo.setCollideWorldBounds(true)
    }
}
