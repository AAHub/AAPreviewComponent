import { Component, Element, State } from "@stencil/core";

@Component({
  tag: "app-preview",
  styleUrl: "app-preview.css"
})
export class PreviewPage {
  @State() aa: string = "";
  @Element() el: HTMLElement;

  setTextareaHeight(ta) {
    ta.style.fontSize = "12px";
    ta.style.lineHeight = "12px";
    ta.style.height = "30px";

    const minHeight = 300;
    if (ta.scrollHeight > ta.offsetHeight) {
      ta.style.height = ta.scrollHeight + "px";
    } else {
      var height, lineHeight;
      let idx = 0;
      while (true) {
        idx = idx + 1;
        height = Number(ta.style.height.split("px")[0]);
        lineHeight = Number(ta.style.lineHeight.split("px")[0]);
        ta.style.height = height - lineHeight + "px";
        if (
          ta.scrollHeight > ta.offsetHeight ||
          minHeight > ta.scrollHeight ||
          idx > 50000
        ) {
          ta.style.height = ta.scrollHeight + "px";
          break;
        }
      }
    }
  }

  getBytes(text: string = "") {
    let count = 0;
    for (let i = 0; i < text.length; i++) {
      let n = encodeURIComponent(text.charAt(i));
      if (n.length < 4) count++;
      else count += 2;
    }
    return count;
  }
  textInput(el) {
    this.setTextareaHeight(el.srcElement);
    this.aa = el.srcElement.value;

    let value = this.aa.replace(/</g, "&lt;");
    this.el.querySelector("#preview").innerHTML = value.replace(
      /\\n|\r\n|\r|\n/g,
      "<br>"
    );
  }

  componentWillLoad() {
    this.aa = "";
    let textarea: any = this.el.querySelector("#aa-textarea");
    textarea.value = "";
    this.el.querySelector("#preview").innerHTML = "";
  }

  render() {
    return [
      <div class="content-wrapper">
        <div class="u-pt20 u-pl8">{this.getBytes(this.aa)}byte</div>
        <div class="input-wrapper">
          <div class="input-aa-wrapper u-flex-wrap">
            <div class="textarea-wrapper">
              <textarea
                id="aa-textarea"
                class="input-aa"
                placeholder="アスキーアートを入力"
                onInput={e => this.textInput(e)}
              />
            </div>
            <div class="preview-wrapper">
              <div class="scroll-wrapper">
                {(() => {
                  if (this.aa == "") {
                    return (
                      <div class="u-aa">
                        プレビュー<br />行頭の半角と途中の半角2以上は除去されます
                      </div>
                    );
                  }
                })()}
                <div id="preview" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ];
  }
}
