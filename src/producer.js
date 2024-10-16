import amqp from "amqplib"

async function main(){
    const connection = await amqp.connect({
        hostname: 'localhost',
        port: 5672,
        username: 'rabbitmq',
        password: 'curso',
    })

    const channel = await connection.createChannel()

    await channel.assertQueue('wpp_queue', {
        durable: true,
    })

    // await channel.publish('', 'wpp_queue', Buffer.from('AAAAI MAJINBUUUuuUUU'))
    await channel.sendToQueue('wpp_queue', Buffer.from('Não quero Babidi'))
    await channel.close()
    await connection.close()
}

main()