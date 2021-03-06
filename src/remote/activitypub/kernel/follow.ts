import * as mongo from 'mongodb';
import User, { IRemoteUser } from '../../../models/user';
import config from '../../../config';
import follow from '../../../services/following/create';
import { IFollow } from '../type';

export default async (actor: IRemoteUser, activity: IFollow): Promise<void> => {
	const id = typeof activity.object == 'string' ? activity.object : activity.object.id;

	if (!id.startsWith(config.url + '/')) {
		return null;
	}

	const followee = await User.findOne({
		_id: new mongo.ObjectID(id.split('/').pop())
	});

	if (followee === null) {
		throw new Error('followee not found');
	}

	if (followee.host != null) {
		throw new Error('フォローしようとしているユーザーはローカルユーザーではありません');
	}

	await follow(actor, followee, activity.id);
};
