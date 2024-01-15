import { BaseCommand, Command, Message } from '../../Structures';
import axios from 'axios';

@Command('facebook', {
    description: 'Download Facebook content',
    category: 'media',
    usage: 'facebook <Facebook post URL>',
    aliases: ['fb'],
    exp: 20,
    cooldown: 1
})
export default class extends BaseCommand {
    public override execute = async ({ reply, urls }: Message): Promise<void> => {
        if (!urls || !urls.length) {
            return void (await reply('❌ Please provide a Facebook post URL'));
        }

        const [url] = urls;
        if (!url.includes('facebook.com')) {
            return void (await reply('❌ Wrong URL! Only Facebook post URLs can be downloaded'));
        }

        try {
            const accessToken = 'YOUR_FACEBOOK_ACCESS_TOKEN';
            const postId = this.extractPostIdFromUrl(url);

            const { data } = await axios.get(
                `https://graph.facebook.com/v14.0/${postId}?fields=attachments&access_token=${accessToken}`
            );

            const attachments = data.attachments?.data;

            if (attachments && attachments.length > 0) {
                const firstAttachment = attachments[0];
                const attachmentUrl = firstAttachment.media.image.src;

                const buffer = await this.client.utils.getBuffer(attachmentUrl);
                await reply(buffer, 'image'); // Adjust type based on the actual content type

            } else {
                await reply(`❌ No media data found for the provided Facebook post URL.`);
            }
        } catch (error: any) {
            await reply(`❌ Error while getting media data: ${(error as Error).message}`);
        }
    };

    private extractPostIdFromUrl(url: string): string {
        // Implement logic to extract the post ID from the URL
        // For example: https://www.facebook.com/{username}/posts/{post_id}
        // Extract the post ID using regular expressions or other suitable methods

        const postIdMatch = url.match(/\/posts\/(\d+)/);
        if (postIdMatch && postIdMatch[1]) {
            return postIdMatch[1];
        } else {
            // Handle the case where the post ID couldn't be extracted
            throw new Error('Failed to extract Facebook post ID from URL');
        }
    }
                         }
        
