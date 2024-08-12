import GTPUtilPlugin, { langOptions } from "main";
import { App, Modal, Setting } from "obsidian";
import { TargetLanguageService } from "targetLanguage.service";

export class TargetLanguageSettingModal extends Modal {
	selectedOption: string;
	private targetLanguageService: TargetLanguageService;

	constructor(
		app: App,
		private langOptions: langOptions[],
		private plugin: GTPUtilPlugin
	) {
		super(app);
		this.selectedOption = langOptions[0].isoCode; // default value
		this.targetLanguageService = new TargetLanguageService();
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.createEl("h2", { text: "GPT Utils" });

		contentEl.createEl("p", {
			text: "For make translation please choose the Target Language to Translate and try again.",
		});

		new Setting(contentEl)
			.setName("Select Target Language Option")
			.addDropdown((dropdown) => {
				this.langOptions.forEach((option) => {
					dropdown.addOption(option.isoCode, option.label);
				});

				dropdown
					.setValue(this.selectedOption)
					.onChange(async (value) => {
						this.plugin.settings.translationOptionsSettings.targetLang.isoCode =
							value;

						this.plugin.settings.translationOptionsSettings.targetLang.label =
							await this.targetLanguageService.setLabelTargetLang(
								value,
								this.langOptions
							);
						await this.plugin.saveSettings();
					});
			});

		new Setting(contentEl).addButton((button) =>
			button
				.setButtonText("Close")
				.setCta()
				.onClick(() => {
					this.close();
				})
		);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
