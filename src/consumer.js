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

    channel.consume('wpp_queue', (data) => {
        const { content } = data
        console.log(content.toString())
        channel.ack(data)
    })
}

main()