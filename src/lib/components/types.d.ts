export type ChatWidgetConfig = {
	webhook: {
		url: string;
		route: string;
	};
	ttsType: string;
	welcomeMessage: string;
	style: {
		primaryColor: string;
		secondaryColor: string;
		position: string;
		backgroundColor: string;
		fontColor: string;
	};
};
