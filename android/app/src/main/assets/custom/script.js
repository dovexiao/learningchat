document.addEventListener('DOMContentLoaded', function() {
    const editor = document.getElementById('editor');

    const editorView = document.getElementById('editor-view');

    // const headingDropdown = document.getElementById('headingDropdown');
    // const headingMenu = document.getElementById('headingMenu');
    // const textColorButton = document.getElementById('textColorButton');
    // const textColorMenu = document.getElementById('textColorMenu');
    // const textColorGrid = document.getElementById('textColorGrid');
    // const bgColorButton = document.getElementById('bgColorButton');
    // const bgColorMenu = document.getElementById('bgColorMenu');
    // const bgColorGrid = document.getElementById('bgColorGrid');
    
    // let activeDropdown = null;
    
    // 初始化编辑器
    initializeEditor();
    
    // 确保编辑器始终有一个 <p><span><br></span></p>
    function ensureMinimumContent() {
        if (editor.innerHTML.trim() === '') {
            editor.innerHTML = '<p><span><br></span></p>';
        }
        
        // 如果编辑器中没有 p 标签，添加一个
        if (!editor.children) {
            editor.innerHTML = '<p><span><br></span></p>';
        }
    }
    
    function initializeEditor() {
        // 确保编辑器有初始内容
        ensureMinimumContent();
        
        // 聚焦编辑器
        editor.focus();
      
        // 将光标放在开始位置
        const firstParagraph = editor.querySelector('p');
        if (firstParagraph) {
            const span = firstParagraph.querySelector('span');
            const range = document.createRange();
            const selection = window.getSelection();
        
            range.setStart(span.firstChild, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };
    
    // 监听编辑器内容变化，确保始终有一个 <p><span><br></span></p>
    editor.addEventListener('input', function() {
        ensureMinimumContent();
    });

    // 创建MutationObserver实例
    const observer = new MutationObserver(() => {
        // 当editor内容变化时，同步到editorView
        sendSelectNode();
        sendEditorHTML();
        editorView.textContent = editor.innerHTML;
    });

    // 配置观察选项
    const config = {
        childList: true,      // 监听子节点的添加或移除
        subtree: true,        // 监听所有后代节点
        characterData: true,   // 监听节点文本内容的变化
        attributes: true, 
        attributeFilter: ['style', 'class'] 
    };

    // 开始观察目标节点
    observer.observe(editor, config);

    // 监听选区变化事件
    document.addEventListener('selectionchange', function() {
        sendSelectNode();
    });

    function sendEditorHTML() {
        if (window.sendToRN) {
            window.sendToRN({
                type: 'EDITOR_HTML',
                body: editor.innerHTML,
            });
        }
    }

    // 发送选区变化
    function sendSelectNode() {
        const paragraphs = getSelectedParagraphs();
        const spans = getSelectedSpans();

        // 初始化 SelectedNode 对象
        const selectedNode = {
            isBold: true,
            isItalic: true,
            isUnderline: true,
            isStrikethrough: true,
            alignment: 'none',
            listType: 'none',
            isIndented: false,
            isQuote: false,
            headingLevel: 'node',
            ftColor: '',
            bgColor: ''
        };

        // 检查段落相关属性
        if (paragraphs.length > 0) {
            let firstAlignment;
            let firstListType;
            let firstIsIndented;
            let firstIsQuote;
            let firstHeadingLevel;

            paragraphs.forEach((paragraph, index) => {
                // 检查对齐方式
                if (index === 0) {
                    for (const align in alignmentClasses) {
                        if (paragraph.classList.contains(alignmentClasses[align])) {
                            firstAlignment = align;
                            selectedNode.alignment = align;
                            break;
                        }
                    }
                } else {
                    let currentAlignment;
                    for (const align in alignmentClasses) {
                        if (paragraph.classList.contains(alignmentClasses[align])) {
                            currentAlignment = align;
                            break;
                        }
                    }
                    if (currentAlignment !== firstAlignment) {
                        selectedNode.alignment = 'none';
                    }
                }

                // 检查列表类型
                if (index === 0) {
                    const list = isInsideList(paragraph);
                    if (list) {
                        firstListType = list.nodeName === 'UL' ? 'unordered' : 'ordered';
                        selectedNode.listType = firstListType;
                    }
                } else {
                    const list = isInsideList(paragraph);
                    if (list) {
                        const currentListType = list.nodeName === 'UL' ? 'unordered' : 'ordered';
                        if (currentListType !== firstListType) {
                            selectedNode.listType = 'none';
                        }
                    } else {
                        selectedNode.listType = 'none';
                    }
                }

                // 检查是否缩进
                if (index === 0) {
                    firstIsIndented = hasIndentPlaceholder(paragraph);
                    selectedNode.isIndented = firstIsIndented;
                } else {
                    const currentIsIndented = hasIndentPlaceholder(paragraph);
                    if (currentIsIndented !== firstIsIndented) {
                        selectedNode.isIndented = false;
                    }
                }

                // 检查是否在引用内部
                if (index === 0) {
                    firstIsQuote = isInsideQuote(paragraph);
                    selectedNode.isQuote = !!firstIsQuote;
                } else {
                    const currentIsQuote = isInsideQuote(paragraph);
                    if (currentIsQuote !== firstIsQuote) {
                        selectedNode.isQuote = false;
                    }
                }

                // 检查段落标签
                if (index === 0) {
                    if (paragraph.nodeName.startsWith('H')) {
                        firstHeadingLevel = `h${paragraph.nodeName.slice(1)}`;
                        selectedNode.headingLevel = firstHeadingLevel;
                    } else {
                        firstHeadingLevel = 'p';
                        selectedNode.headingLevel = 'p';
                    }
                } else {
                    let currentHeadingLevel;
                    if (paragraph.nodeName.startsWith('H')) {
                        currentHeadingLevel = `h${paragraph.nodeName.slice(1)}`;
                    } else {
                        currentHeadingLevel = 'p';
                    }
                    if (currentHeadingLevel !== firstHeadingLevel) {
                        selectedNode.headingLevel = 'none';
                    }
                }
            });
        }

        // 检查文本样式和颜色
        if (spans.length > 0) {
            let firstFtColor;
            let firstBgColor;

            spans.forEach((span, index) => {
                // 检查文本样式
                if (!hasStyleClass(span, textStyleClasses.bold)) {
                    selectedNode.isBold = false;
                }
                if (!hasStyleClass(span, textStyleClasses.italic)) {
                    selectedNode.isItalic = false;
                }
                if (!hasStyleClass(span, textStyleClasses.underline)) {
                    selectedNode.isUnderline = false;
                }
                if (!hasStyleClass(span, textStyleClasses.strikethrough)) {
                    selectedNode.isStrikethrough = false;
                }

                // 检查字体颜色
                if (index === 0) {
                    firstFtColor = span.style.color;
                    selectedNode.ftColor = firstFtColor;
                } else {
                    const currentFtColor = span.style.color;
                    if (currentFtColor !== firstFtColor) {
                        selectedNode.ftColor = '';
                    }
                }

                // 检查背景颜色
                if (index === 0) {
                    firstBgColor = span.style.backgroundColor;
                    selectedNode.bgColor = firstBgColor;
                } else {
                    const currentBgColor = span.style.backgroundColor;
                    if (currentBgColor !== firstBgColor) {
                        selectedNode.bgColor = '';
                    }
                }
            });
        }

        if (window.sendToRN) {
            window.sendToRN({
                type: 'SELECTED_NODE',
                body: selectedNode
            });
        }
        console.log(selectedNode);
    }
    
    // 颜色选择器的颜色
    // const colors = [
    //   '#000000', '#434343', '#666666', '#999999', '#b7b7b7', 
    //   '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
    //   '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00',
    //   '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff'
    // ];
    
    // 创建颜色样本
    // colors.forEach(color => {
    //     // 文本颜色样本
    //     const textSwatch = document.createElement('div');
    //     textSwatch.className = 'color-swatch';
    //     textSwatch.style.backgroundColor = color;
    //     textSwatch.addEventListener('mousedown', (e) => {
    //         e.preventDefault();
    //     });
    //     textSwatch.addEventListener('click', () => {
    //         applyTextColor(color);
    //         closeDropdown();
    //     });
    //     textColorGrid.appendChild(textSwatch);
      
    //     // 背景颜色样本
    //     const bgSwatch = document.createElement('div');
    //     bgSwatch.className = 'color-swatch';
    //     bgSwatch.style.backgroundColor = color;
    //     bgSwatch.addEventListener('mousedown', (e) => {
    //         e.preventDefault();
    //     });
    //     bgSwatch.addEventListener('click', () => {
    //         applyBackgroundColor(color);
    //         closeDropdown();
    //     });
    //     bgColorGrid.appendChild(bgSwatch);
    // });

    // 监听粘贴事件
    // editor.addEventListener('paste', handlePaste);
    
    // 处理回车键创建新段落
    editor.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const startParagraph = getParentParagraph(range.startContainer);
            
            if (!startParagraph) return;
            
            // 创建新段落
            const newParagraph = document.createElement('p');
            newParagraph.innerHTML = '<span><br></span>';
        
            // // 如果当前段落有对齐类，将其应用到新段落
            // const alignmentClass = getAlignmentClass(startNode);
            // if (alignmentClass) {
            //   newParagraph.classList.add(alignmentClass);
            // }
            
            // 如果我们在段落中间，分割它
            // if (!range.collapsed || range.startOffset < startNode.textContent.length) {
            //   const endRange = range.cloneRange();
            //   endRange.setStartAfter(range.endContainer);
            //   endRange.setEndAfter(startNode);
                
            //   // 提取光标后的内容
            //   const fragment = endRange.extractContents();
            //   newParagraph.innerHTML = '';
            //   newParagraph.appendChild(fragment);
                
            //   // 如果新段落为空，添加一个换行符
            //   if (newParagraph.innerHTML === '') {
            //     newParagraph.innerHTML = '<span><br></span>';
            //   }
            // }
            
            if (isInsideListItem(startParagraph)) {
                const newListItem = document.createElement('li');
                newListItem.appendChild(newParagraph);
                const startListItem = startParagraph.parentNode;
                if (startListItem.nextSibling) {
                    startListItem.parentNode.insertBefore(newListItem, startListItem.nextSibling);
                } else {
                    startListItem.parentNode.appendChild(newListItem);
                }
            } else {
                if (startParagraph.nextSibling) {
                    startParagraph.parentNode.insertBefore(newParagraph, startParagraph.nextSibling);
                } else {
                    startParagraph.parentNode.appendChild(newParagraph);
                }
            }
            
            // 将光标移动到新段落
            const span = newParagraph.querySelector('span');
            range.setStart(span.firstChild, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            // const selection = window.getSelection();
            // if (!selection.rangeCount) return;
            // const range = selection.getRangeAt(0);

            // e.preventDefault();
            // const content = e.key;

        }
    });

    // 点击 editor 空白区域新增段落
    editor.addEventListener('click', function(e) {
        if (e.target === this) {
            const lastChild = this.lastElementChild;
            if (!lastChild || lastChild.outerHTML !== '<p><span><br></span></p>') {
                const newParagraph = document.createElement('p');
                newParagraph.innerHTML = '<span><br></span>';
                this.appendChild(newParagraph);

                // 将光标移动到新段落
                const span = newParagraph.querySelector('span');
                const range = document.createRange();
                const sel = window.getSelection();
                range.setStart(span.firstChild, 0);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    });
    
    // 获取节点的父段落 p+h
    function getParentParagraph(node) {
      while (node && ( node.nodeName !== 'P' && !node.nodeName.startsWith('H'))) {
        node = node.parentNode;
        if (node === editor) return null;
      }
      return node;
    }
    
    // 获取选中文本所属的所有段落 p+h
    function getSelectedParagraphs() {
      const selection = window.getSelection();
      if (!selection.rangeCount) return [];
      
      const range = selection.getRangeAt(0);
      
      // 如果选择是折叠的，只返回当前段落
      if (range.collapsed) {
        const paragraph = getParentParagraph(range.startContainer);
        return paragraph ? [paragraph] : [];
      }
      
      // 获取选择中的所有段落
      const startParagraph = getParentParagraph(range.startContainer);
      const endParagraph = getParentParagraph(range.endContainer);
      
      if (!startParagraph || !endParagraph) return [];
      
      // 如果开始和结束是同一个段落
      if (startParagraph === endParagraph) {
        return [startParagraph];
      }
      
      // 获取开始和结束之间的所有段落
      const paragraphs = [];
      let isSelected = false;

      let rootNode = range.commonAncestorContainer;
      const stack = [];
      stack.push(rootNode);

      while (stack.length > 0) {
        const currentNode = stack.pop();

        if (currentNode === startParagraph) {
            isSelected = true;
        }
        
        if ((currentNode.nodeName === 'P' || currentNode.nodeName.startsWith('H')) && isSelected) {
            paragraphs.push(currentNode);
        }

        if (currentNode === endParagraph) {
            break;
        }

        if (currentNode.nodeName === 'P' || currentNode.nodeName.startsWith('H')) {
            continue;
        }

        // 将子节点逆序压入栈中
        const children = currentNode.children;
        for (let i = children.length - 1; i >= 0; i--) {
            stack.push(children[i]);
        }
      }
      
      return paragraphs;
    }

    // 获取选中的所有文本
    function getSelectedSpans() {
      const selection = window.getSelection();
      if (!selection.rangeCount) return [];
      
      const range = selection.getRangeAt(0);
      
      // 如果选择是折叠的，只返回当前段落
      if (range.collapsed) {
        const span = range.startContainer.parentNode;
        return span ? [span] : [];
      }
      
      // 获取选择中的所有段落
      const startSpan = range.startContainer.parentNode;
      const endSpan = range.endContainer.parentNode;
      
      if (!startSpan || !endSpan) return [];
      
      // 如果开始和结束是同一个段落
      if (startSpan === endSpan) {
        return [startSpan];
      }
      
      // 获取开始和结束之间的所有段落
      const spans = [];
      let isSelected = false;

      let rootNode = range.commonAncestorContainer;
      const stack = [];
      stack.push(rootNode);

      while (stack.length > 0) {
        const currentNode = stack.pop();

        if (currentNode === startSpan) {
            isSelected = true;
        }
        
        if ((currentNode.nodeName === 'SPAN') && isSelected) {
            spans.push(currentNode);
        }

        if (currentNode === endSpan) {
            break;
        }

        if (currentNode.nodeName === 'SPAN') {
            continue;
        }

        // 将子节点逆序压入栈中
        const children = currentNode.children;
        for (let i = children.length - 1; i >= 0; i--) {
            stack.push(children[i]);
        }
      }
      
      return spans;
    } 

    // 定义文本样式类名
    const textStyleClasses = {
      'bold': 'text-bold',
      'italic': 'text-italic',
      'underline': 'text-underline',
      'strikethrough': 'text-strikethrough',
      'no-bold': 'no-bold',
      'no-italic': 'no-italic',
      'no-underline': 'no-underline',
      'no-strikethrough': 'no-strikethrough',
    };
    
    // 检查节点是否有指定的样式类
    function hasStyleClass(node, styleClass) {
      return node && node.classList && node.classList.contains(styleClass);
    }
    
    // 获取节点的所有样式类
    function getStyleClasses(node) {
      if (!node || !node.classList) return [];
      
      const classes = [];
      for (const style in textStyleClasses) {
        if (node.classList.contains(textStyleClasses[style])) {
          classes.push(textStyleClasses[style]);
        }
      }
      return classes;
    }
    
    // 检查两个节点是否有相同的样式类
    function hasSameStyleClasses(node1, node2) {
      const classes1 = getStyleClasses(node1);
      const classes2 = getStyleClasses(node2);
      
      if (classes1.length !== classes2.length) return false;
      
      return classes1.every(cls => classes2.includes(cls));
    }
    
    // 应用文本样式
    function applyTextFormat(format) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
      
        const range = selection.getRangeAt(0);
        if (range.collapsed) return;
      
        // 获取选中的段落
        const paragraphs = getSelectedParagraphs();
        if (paragraphs.length === 0) return;

        let isSelected = {
            value: false,
        };
      
        // 处理每个段落
        paragraphs.forEach(paragraph => {
            // 处理段落内的选中文本
            processSelectedText(paragraph, range, format, isSelected);
            // 合并相邻的具有相同样式的span
            mergeAdjacentSpans(paragraph, range);
        });
      
        // 恢复原始选择
        selection.removeAllRanges();
        selection.addRange(range);
        pushUndoStack();
    }
    
    // 处理段落内的选中文本
    function processSelectedText(paragraph, range, format, isSelected) {
        const startOffset = range.startOffset;
        const endOffset = range.endOffset;
        const startContainer = range.startContainer;
        const endContainer = range.endContainer;
        const styleClass = textStyleClasses[format];
        const spans = Array.from(paragraph.children);

        for (let i = 0; i < spans.length; i++) {
            const span = spans[i];
            const textNode = span.firstChild;

            if (textNode === startContainer && textNode === endContainer) {
                // span的文本既为range.startContainer也为range.endContainer
                const firstPart = textNode.textContent.slice(0, startOffset);
                const selectedPart = textNode.textContent.slice(startOffset, endOffset);
                const lastPart = textNode.textContent.slice(endOffset);

                const firstSpan = firstPart? createSpan(firstPart, span) : null;
                const selectedSpan = selectedPart? createSpan(selectedPart, span) : null;
                const lastSpan = lastPart? createSpan(lastPart, span) : null;

                if (styleClass.split('-')[0] === 'no') {
                    const deleteStyleClass = textStyleClasses[styleClass.split('-')[1]];
                    if (selectedSpan && hasStyleClass(selectedSpan, deleteStyleClass)) {
                        selectedSpan.classList.remove(deleteStyleClass);
                    }
                } else if (selectedSpan && !hasStyleClass(selectedSpan, styleClass)) {
                    selectedSpan.classList.add(styleClass);
                }

                if (firstSpan) paragraph.insertBefore(firstSpan, span);
                if (selectedSpan) paragraph.insertBefore(selectedSpan, span);
                if (lastSpan) paragraph.insertBefore(lastSpan, span);
                paragraph.removeChild(span);

                if (selectedSpan) {
                    range.setStart(selectedSpan.firstChild, 0);
                    range.setEnd(selectedSpan.firstChild, selectedSpan.textContent.length);
                }

                isSelected.value = false;

                break;
            } else if (textNode === startContainer) {
                // span的文本仅是range.startContainer
                const firstPart = textNode.textContent.slice(0, startOffset);
                const selectedPart = textNode.textContent.slice(startOffset);

                const firstSpan = firstPart? createSpan(firstPart, span) : null;
                const selectedSpan = selectedPart? createSpan(selectedPart, span) : null;

                if (styleClass.split('-')[0] === 'no') {
                    const deleteStyleClass = textStyleClasses[styleClass.split('-')[1]];
                    if (selectedSpan && hasStyleClass(selectedSpan, deleteStyleClass)) {
                        selectedSpan.classList.remove(deleteStyleClass);
                    }
                } else if (selectedSpan && !hasStyleClass(selectedSpan, styleClass)) {
                    selectedSpan.classList.add(styleClass);
                }

                if (firstSpan) paragraph.insertBefore(firstSpan, span);
                if (selectedSpan) paragraph.insertBefore(selectedSpan, span);
                paragraph.removeChild(span);

                if (selectedSpan) {
                    range.setStart(selectedSpan.firstChild, 0);
                }

                isSelected.value = true;
            } else if (textNode === endContainer) {
                // 该span仅是range.endContainer
                const selectedPart = textNode.textContent.slice(0, endOffset);
                const lastPart = textNode.textContent.slice(endOffset);

                const selectedSpan = selectedPart? createSpan(selectedPart, span) : null;
                const lastSpan = lastPart? createSpan(lastPart, span) : null;
                
                if (styleClass.split('-')[0] === 'no') {
                    const deleteStyleClass = textStyleClasses[styleClass.split('-')[1]];
                    if (selectedSpan && hasStyleClass(selectedSpan, deleteStyleClass)) {
                        selectedSpan.classList.remove(deleteStyleClass);
                    }
                } else if (selectedSpan && !hasStyleClass(selectedSpan, styleClass)) {
                    selectedSpan.classList.add(styleClass);
                }

                if (selectedSpan) paragraph.insertBefore(selectedSpan, span);
                if (lastSpan) paragraph.insertBefore(lastSpan, span);
                paragraph.removeChild(span);

                if (selectedSpan) {
                    range.setEnd(selectedSpan.firstChild, selectedSpan.textContent.length);
                }

                isSelected.value = false;

                break;
            } else {
                if (styleClass.split('-')[0] === 'no') {
                    const deleteStyleClass = textStyleClasses[styleClass.split('-')[1]];
                    if (hasStyleClass(span, deleteStyleClass)) {
                        span.classList.remove(deleteStyleClass);
                    }
                } else if (!isSelected.value) continue;
                // 都不是，不用拆span，整个span都是选中span
                if (!hasStyleClass(span, styleClass)) {
                    span.classList.add(styleClass);
                }
            }
        }

        function createSpan(text, sourceSpan) {
            const newSpan = document.createElement('span');
            newSpan.textContent = text;
            const classes = getStyleClasses(sourceSpan);
            classes.forEach(className => newSpan.classList.add(className));
            const style = sourceSpan.style;
            for (let i = 0; i < style.length; i++) {
                const property = style[i];
                newSpan.style[property] = style.getPropertyValue(property);
            }    
            return newSpan;
        }
    }
    
    // 合并相邻的具有相同样式的span
    function mergeAdjacentSpans(paragraph, range) {
        const spans = paragraph.querySelectorAll('span');
        let currentSpan = null;
      
        let newStartSpan;
        let newEndSpan;
        let newStartOffset;
        let newEndOffset;

        for (let i = 0; i < spans.length; i++) {
            const span = spans[i];
        
            // 如果当前没有正在处理的span，将这个span设为当前span
            if (!currentSpan) {
                currentSpan = span;

                if (currentSpan.firstChild === range.startContainer) {
                    newStartSpan = currentSpan;
                    newStartOffset = 0;
                }

                if (currentSpan.firstChild === range.endContainer) {
                    newEndSpan = currentSpan;
                    newEndOffset = currentSpan.textContent.length;
                }

                continue;
            }
        
            // 检查当前span和下一个span是否相邻且具有相同的样
            if (span.previousSibling === currentSpan && hasSameStyleClasses(span, currentSpan) && 
                (!span.getAttribute('style') && !currentSpan.getAttribute('style') || 
                span.getAttribute('style') === currentSpan.getAttribute('style'))) {

                // 合并span

                if (span.firstChild === range.startContainer) {
                    newStartSpan = currentSpan;
                    newStartOffset = currentSpan.textContent.length;
                }

                if (span.firstChild === range.endContainer) {
                    newEndSpan = currentSpan;
                    newEndOffset = currentSpan.textContent.length + span.textContent.length;
                }

                currentSpan.textContent += span.textContent;
                
                span.parentNode.removeChild(span);
            } else {
                // 如果不能合并，将这个span设为当前span
                currentSpan = span;

                if (currentSpan.firstChild === range.startContainer) {
                    newStartSpan = currentSpan;
                    newStartOffset = 0;
                }

                if (currentSpan.firstChild === range.endContainer) {
                    newEndSpan = currentSpan;
                    newEndOffset = currentSpan.textContent.length;
                }
            }
        }

        if (newStartSpan && newEndSpan) {
            range.setStart(newStartSpan.firstChild, newStartOffset);
            range.setEnd(newEndSpan.firstChild, newEndOffset);
        }
    }
    
    // 定义对齐类名
    const alignmentClasses = {
      'left': 'text-left',
      'center': 'text-center',
      'right': 'text-right',
    };
    
    // 获取段落的对齐类
    // function getAlignmentClass(paragraph) {
    //   for (const align in alignmentClasses) {
    //     if (paragraph.classList.contains(alignmentClasses[align])) {
    //       return alignmentClasses[align];
    //     }
    //   }
    //   return null;
    // }
    
    // 移除所有对齐类
    function removeAlignmentClasses(paragraph) {
      for (const align in alignmentClasses) {
        paragraph.classList.remove(alignmentClasses[align]);
      }
    }
    
    // 应用文本对齐
    function applyTextAlignment(alignment) {
      const paragraphs = getSelectedParagraphs();
      if (paragraphs.length === 0) return;
      
      const alignClass = alignmentClasses[alignment];
      if (!alignClass) return;
      
      paragraphs.forEach(paragraph => {
        removeAlignmentClasses(paragraph);
        paragraph.classList.add(alignClass);
      });

      pushUndoStack();
    }
    
    // 应用文本颜色
    function applyTextColor(color) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
    
        const range = selection.getRangeAt(0);
        if (range.collapsed) return;
    
        // 获取选中的段落
        const paragraphs = getSelectedParagraphs();
        if (paragraphs.length === 0) return;
    
        let isSelected = {
            value: false
        };
    
        // 处理每个段落
        paragraphs.forEach(paragraph => {
            // 处理段落内的选中文本
            processSelectedTextWithColor(paragraph, range, 'color', color, isSelected);
            // 合并相邻的具有相同样式的span
            mergeAdjacentSpans(paragraph, range);
        });
    
        // 恢复原始选择
        selection.removeAllRanges();
        selection.addRange(range);
        pushUndoStack();
    }
    
    // 应用背景颜色
    function applyBackgroundColor(color) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
    
        const range = selection.getRangeAt(0);
        if (range.collapsed) return;
    
        // 获取选中的段落
        const paragraphs = getSelectedParagraphs();
        if (paragraphs.length === 0) return;
    
        let isSelected = {
            value: false
        };
    
        // 处理每个段落
        paragraphs.forEach(paragraph => {
            // 处理段落内的选中文本
            processSelectedTextWithColor(paragraph, range, 'backgroundColor', color, isSelected);
            // 合并相邻的具有相同样式的span
            mergeAdjacentSpans(paragraph, range);
        });
    
        // 恢复原始选择
        selection.removeAllRanges();
        selection.addRange(range);
        pushUndoStack();
    }

    // 处理段落内的选中文本并应用颜色样式
    function processSelectedTextWithColor(paragraph, range, styleProperty, color, isSelected) {
        const startOffset = range.startOffset;
        const endOffset = range.endOffset;
        const startContainer = range.startContainer;
        const endContainer = range.endContainer;
        const spans = Array.from(paragraph.children);

        for (let i = 0; i < spans.length; i++) {
            const span = spans[i];
            const textNode = span.firstChild;

            if (textNode === startContainer && textNode === endContainer) {
                // span的文本既为range.startContainer也为range.endContainer
                const firstPart = textNode.textContent.slice(0, startOffset);
                const selectedPart = textNode.textContent.slice(startOffset, endOffset);
                const lastPart = textNode.textContent.slice(endOffset);

                const firstSpan = firstPart? createSpan(firstPart, span) : null;
                const selectedSpan = selectedPart? createSpan(selectedPart, span) : null;
                const lastSpan = lastPart? createSpan(lastPart, span) : null;

                if (selectedSpan) {
                    selectedSpan.style[styleProperty] = color;
                }

                if (firstSpan) paragraph.insertBefore(firstSpan, span);
                if (selectedSpan) paragraph.insertBefore(selectedSpan, span);
                if (lastSpan) paragraph.insertBefore(lastSpan, span);
                paragraph.removeChild(span);

                if (selectedSpan) {
                    range.setStart(selectedSpan.firstChild, 0);
                    range.setEnd(selectedSpan.firstChild, selectedSpan.textContent.length);
                }

                isSelected.value = false;

                break;
            } else if (textNode === startContainer) {
                // span的文本仅是range.startContainer
                const firstPart = textNode.textContent.slice(0, startOffset);
                const selectedPart = textNode.textContent.slice(startOffset);

                const firstSpan = firstPart? createSpan(firstPart, span) : null;
                const selectedSpan = selectedPart? createSpan(selectedPart, span) : null;

                if (selectedSpan) {
                    selectedSpan.style[styleProperty] = color;
                }

                if (firstSpan) paragraph.insertBefore(firstSpan, span);
                if (selectedSpan) paragraph.insertBefore(selectedSpan, span);
                paragraph.removeChild(span);

                if (selectedSpan) {
                    range.setStart(selectedSpan.firstChild, 0);
                }

                isSelected.value = true;
            } else if (textNode === endContainer) {
                // 该span仅是range.endContainer
                const selectedPart = textNode.textContent.slice(0, endOffset);
                const lastPart = textNode.textContent.slice(endOffset);

                const selectedSpan = selectedPart? createSpan(selectedPart, span) : null;
                const lastSpan = lastPart? createSpan(lastPart, span) : null;

                if (selectedSpan) {
                    selectedSpan.style[styleProperty] = color;
                }

                if (selectedSpan) paragraph.insertBefore(selectedSpan, span);
                if (lastSpan) paragraph.insertBefore(lastSpan, span);
                paragraph.removeChild(span);

                if (selectedSpan) {
                    range.setEnd(selectedSpan.firstChild, selectedSpan.textContent.length);
                }

                isSelected.value = false;

                break;
            } else {
                if (!isSelected.value) continue;
                // 都不是，不用拆span，整个span都是选中span
                span.style[styleProperty] = color;
            }
        }

        function createSpan(text, sourceSpan) {
            const newSpan = document.createElement('span');
            newSpan.textContent = text;
            const classes = getStyleClasses(sourceSpan);
            classes.forEach(className => newSpan.classList.add(className));
            const style = sourceSpan.style;
            for (let i = 0; i < style.length; i++) {
                const property = style[i];
                newSpan.style[property] = style.getPropertyValue(property);
            }    
            return newSpan;
        }
    }
    
    // 应用标题
    function applyHeading(headingType) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const startContainer = range.startContainer;
        const endContainer = range.endContainer;
        const startOffset = range.startOffset;
        const endOffset = range.endOffset;

        const paragraphs = getSelectedParagraphs();
        if (paragraphs.length === 0) return;
    
        paragraphs.forEach(paragraph => {
            let newHeading;
            if (headingType === 'default') {
                // 将h标签转换为p标签
                if (paragraph.nodeName.startsWith('H')) {
                    newHeading = document.createElement('p');
                } else {
                    return;
                }
            } else {
                // 创建对应的h标签
                newHeading = document.createElement(headingType);
            }
    
            // 继承原段落的样式类
            const classes = paragraph.classList;
            classes.forEach(cls => {
                newHeading.classList.add(cls);
            });
    
            // 继承原段落的子元素
            while (paragraph.firstChild) {
                newHeading.appendChild(paragraph.firstChild);
            }
    
            // 替换原段落
            paragraph.parentNode.replaceChild(newHeading, paragraph);
        });

        range.setStart(startContainer, startOffset);
        range.setEnd(endContainer, endOffset);
        selection.removeAllRanges();
        selection.addRange(range);
        pushUndoStack();
    }
    
    // 检查段落是否有缩进
    function hasIndentPlaceholder(paragraph) {
        return paragraph.classList.contains('indent');
    }
    
    // 应用缩进
    function applyIndent() {
        const paragraphs = getSelectedParagraphs();
        if (paragraphs.length === 0) return;
      
        paragraphs.forEach(paragraph => {
            // 如果段落已经有缩进，不做任何事
            if (hasIndentPlaceholder(paragraph)) return;
        
            // 增加缩进
            paragraph.classList.add('indent');
        });

        pushUndoStack();
    }
    
    // 移除缩进
    function removeIndent() {
        const paragraphs = getSelectedParagraphs();
        if (paragraphs.length === 0) return;
      
        paragraphs.forEach(paragraph => {
            // 如果段落有缩进样式，删除它
            paragraph.classList.remove('indent');
        });

        pushUndoStack();
    }
    
    // 检查节点是否在列表中
    function isInsideList(node) {
      while (node && node !== editor) {
        if (node.nodeName === 'UL' || node.nodeName === 'OL') {
          return node;
        }
        node = node.parentNode;
      }
      return null;
    }
    
    // 检查节点是否在列表项中
    function isInsideListItem(node) {
      while (node && node !== editor) {
        if (node.nodeName === 'LI') {
          return node;
        }
        node = node.parentNode;
      }
      return null;
    }
    
    // 检查节点是否在引用块中
    function isInsideQuote(node) {
      while (node && node !== editor) {
        if (node.classList && node.classList.contains('quote-block')) {
          return node;
        }
        node = node.parentNode;
      }
      return null;
    }
    
    // 创建引用块
    function createBlockquote() {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const startContainer = range.startContainer;
        const endContainer = range.endContainer;
        const startOffset = range.startOffset;
        const endOffset = range.endOffset;

        const paragraphs = getSelectedParagraphs();
        if (paragraphs.length === 0) return;

        const nodeArgs = [];

        for (let i = 0; i < paragraphs.length; i ++ ) {
            const paragraph = paragraphs[i];
            let node = paragraph
            if (!isInsideListItem(node) && !isInsideQuote(node)) {
                nodeArgs.push(node);
                continue;
            }
            if (!isInsideQuote(node)) {
                node = isInsideList(node);
                if (nodeArgs[nodeArgs.length - 1] !== node) {
                    nodeArgs.push(node);
                }
                continue;
            }
            node = isInsideQuote(node);
            if (nodeArgs[nodeArgs.length - 1] !== node) {
                nodeArgs.push(node);
            }
        }

        const quoteBlock = document.createElement('div');
        quoteBlock.className = 'quote-block';

        nodeArgs[0].parentNode.insertBefore(quoteBlock, nodeArgs[0]);

        nodeArgs.forEach(node => {
            if (node.nodeName === 'P' || node.nodeName === 'OL' || node.nodeName === 'UL' || node.nodeName.startsWith('H')) {
                quoteBlock.appendChild(node);
            } else {
                Array.from(node.children).forEach(qNode => {
                    quoteBlock.appendChild(qNode);
                })
                node.parentNode.removeChild(node);
            }
        })
        
        range.setStart(startContainer, startOffset);
        range.setEnd(endContainer, endOffset);
        selection.removeAllRanges();
        selection.addRange(range);

        pushUndoStack();
    }
    
    // 创建无序列表
    function createUnorderedList() {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const startContainer = range.startContainer;
        const endContainer = range.endContainer;
        const startOffset = range.startOffset;
        const endOffset = range.endOffset;

        const paragraphs = getSelectedParagraphs();
        if (paragraphs.length === 0) return;
        
        // 创建新的有序列表
        const ul = document.createElement('ul');
  
        // 在第一个段落之前或第一个段落对应的列表后插入列表
        const listItem0 = isInsideListItem(paragraphs[0]);
        
        if (listItem0) {
            const parentList = listItem0.parentNode;
            if (parentList.nextSibling) {
                parentList.parentNode.insertBefore(ul, parentList.nextSibling);
            } else {
                parentList.parentNode.appendChild(ul);
            }
        } else {
            paragraphs[0].parentNode.insertBefore(ul, paragraphs[0]);
        }
  
        const listItem1 = isInsideListItem(paragraphs[paragraphs.length - 1]);
  
        if (listItem0 && listItem1 && listItem0.parentNode === listItem1.parentNode) {
            const parentList = listItem0.parentNode;
            const endL = document.createElement(parentList.nodeName === 'UL' ? 'ul' : 'ol');
            if (parentList.nextSibling) {
                parentList.parentNode.insertBefore(endL, ul.nextSibling);
            } else {
                parentList.parentNode.appendChild(endL);
            }
            while(listItem1.nextSibling) {
                endL.appendChild(listItem1.nextSibling);
            }
        }
  
        // 处理每个段落
        paragraphs.forEach(paragraph => {
            // 检查段落是否已经在列表项中
            const listItem = isInsideListItem(paragraph);
          
            if (listItem) {
                // 如果已经在列表项中，先从原列表中移除
                const parentList = listItem.parentNode;
            
                // 创建新的列表项
                const newListItem = document.createElement('li');
                ul.appendChild(newListItem);
                newListItem.appendChild(paragraph);
            
                // 如果原列表项为空，删除它
                if (!listItem.hasChildNodes()) {
                    parentList.removeChild(listItem);
                }
            
                // 如果原列表为空，删除它
                if (!parentList.hasChildNodes()) {
                    parentList.parentNode.removeChild(parentList);
                }
            } else {
                // 如果不在列表项中，创建新的列表项
                const li = document.createElement('li');
                ul.appendChild(li);
                li.appendChild(paragraph);
            }
        });

        range.setStart(startContainer, startOffset);
        range.setEnd(endContainer, endOffset);
        selection.removeAllRanges();
        selection.addRange(range);
        pushUndoStack();
    }
    
    // 创建有序列表
    function createOrderedList() {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const startContainer = range.startContainer;
        const endContainer = range.endContainer;
        const startOffset = range.startOffset;
        const endOffset = range.endOffset;

        const paragraphs = getSelectedParagraphs();
        if (paragraphs.length === 0) return;
      
        // 创建新的有序列表
        const ol = document.createElement('ol');

        // 在第一个段落之前或第一个段落对应的列表后插入列表
        const listItem0 = isInsideListItem(paragraphs[0]);

        if (listItem0) {
            const parentList = listItem0.parentNode;
            if (parentList.nextSibling) {
                parentList.parentNode.insertBefore(ol, parentList.nextSibling);
            } else {
                parentList.parentNode.appendChild(ol);
            }
        } else {
            paragraphs[0].parentNode.insertBefore(ol, paragraphs[0]);
        }

        const listItem1 = isInsideListItem(paragraphs[paragraphs.length - 1]);

        if (listItem0 && listItem1 && listItem0.parentNode === listItem1.parentNode) {
            const parentList = listItem0.parentNode;
            const endL = document.createElement(parentList.nodeName === 'UL' ? 'ul' : 'ol');
            if (parentList.nextSibling) {
                parentList.parentNode.insertBefore(endL, ol.nextSibling);
            } else {
                parentList.parentNode.appendChild(endL);
            }

            while(listItem1.nextSibling) {
                endL.appendChild(listItem1.nextSibling);
            }
        }

        // 处理每个段落
        paragraphs.forEach(paragraph => {
            // 检查段落是否已经在列表项中
            const listItem = isInsideListItem(paragraph);
        
            if (listItem) {
                // 如果已经在列表项中，先从原列表中移除
                const parentList = listItem.parentNode;
          
                // 创建新的列表项
                const newListItem = document.createElement('li');
                ol.appendChild(newListItem);
                newListItem.appendChild(paragraph);
          
                // 如果原列表项为空，删除它
                if (!listItem.hasChildNodes()) {
                    parentList.removeChild(listItem);
                }
          
                // 如果原列表为空，删除它
                if (!parentList.hasChildNodes()) {
                    parentList.parentNode.removeChild(parentList);
                }
            } else {
                // 如果不在列表项中，创建新的列表项
                const li = document.createElement('li');
                ol.appendChild(li);
                li.appendChild(paragraph);
            }
        });

        range.setStart(startContainer, startOffset);
        range.setEnd(endContainer, endOffset);
        selection.removeAllRanges();
        selection.addRange(range);

        pushUndoStack();
    }

    // 撤销栈
    const undoStack = [];
    // 重做栈
    const redoStack = [];
    // 初始化，将编辑器初始状态压入撤销栈
    undoStack.push(editor.innerHTML);
    editor.addEventListener('input', () => {
        pushUndoStack();
    });
    function pushUndoStack() {
        // 有新输入时，清空重做栈
        redoStack.length = 0;
        // 将当前编辑器内容压入撤销栈
        undoStack.push(editor.innerHTML);
    }
    // 撤销函数
    function undo() {
        if (undoStack.length > 1) {
            // 将当前状态压入重做栈
            redoStack.push(undoStack.pop());
            // 从撤销栈取出上一个状态应用到编辑器
            editor.innerHTML = undoStack[undoStack.length - 1];
        }
    }
    // 重做函数
    function redo() {
        if (redoStack.length > 0) {
            // 将当前状态压入撤销栈
            undoStack.push(redoStack.pop());
            // 从重做栈取出下一个状态应用到编辑器
            editor.innerHTML = undoStack[undoStack.length - 1];
        }
    }
    
    // 处理操作按钮点击
    // document.querySelectorAll('.op-button[data-format]').forEach(button => {
    //   button.addEventListener('click', () => {
    //     const format = button.getAttribute('data-format');
    //     applyTextFormat(format);
    //   });
    // });
    
    // document.querySelectorAll('.op-button[data-align]').forEach(button => {
    //   button.addEventListener('click', () => {
    //     const align = button.getAttribute('data-align');
    //     applyTextAlignment(align);
    //   });
    // });
    
    // document.querySelectorAll('.op-button[data-action]').forEach(button => {
    //   button.addEventListener('click', () => {
    //     const action = button.getAttribute('data-action');
        
    //     switch (action) {
    //       case 'undo':
    //         undo();
    //         break;
    //       case 'redo':
    //         redo();
    //         break;
    //       case 'indent':
    //         applyIndent();
    //         break;
    //       case 'outdent':
    //         removeIndent();
    //         break;
    //       case 'quote':
    //         createBlockquote();
    //         break;
    //       case 'unorderedList':
    //         createUnorderedList();
    //         break;
    //       case 'orderedList':
    //         createOrderedList();
    //         break;
    //     }
    //   });
    // });
    
    // 处理标题下拉菜单项
    // document.querySelectorAll('[data-heading]').forEach(item => {
    //   item.addEventListener('click', () => {
    //     const heading = item.getAttribute('data-heading');
    //     applyHeading(heading);
    //     closeDropdown();
    //   });
    // });
    
    // 切换下拉菜单
    // function toggleDropdown(dropdown) {
    //   if (activeDropdown) {
    //     activeDropdown.classList.remove('show');
    //   }
      
    //   if (activeDropdown !== dropdown) {
    //     dropdown.classList.add('show');
    //     activeDropdown = dropdown;
    //   } else {
    //     activeDropdown = null;
    //   }
    // }
    
    // 关闭所有下拉菜单
    // function closeDropdown() {
    //   if (activeDropdown) {
    //     activeDropdown.classList.remove('show');
    //     activeDropdown = null;
    //   }
    // }
    
    // 标题下拉菜单
    // headingDropdown.addEventListener('click', () => {
    //   toggleDropdown(headingMenu);
    // });
    
    // 文本颜色下拉菜单
    // textColorButton.addEventListener('click', () => {
    //   toggleDropdown(textColorMenu);
    // });
    
    // 背景颜色下拉菜单
    // bgColorButton.addEventListener('click', () => {
    //   toggleDropdown(bgColorMenu);
    // });
    
    // 点击外部时关闭下拉菜单
    // document.addEventListener('click', (e) => {
    //   if (!e.target.closest('.dropdown') && activeDropdown) {
    //     closeDropdown();
    //   }
    // });
    
    // 防止下拉菜单点击冒泡
    // document.querySelectorAll('.dropdown-menu').forEach(menu => {
    //   menu.addEventListener('click', (e) => {
    //     e.stopPropagation();
    //   });
    // });
    
    
    // 监听编辑器失去焦点事件，确保始终有内容
    editor.addEventListener('blur', function() {
      ensureMinimumContent();
    });


    window.applyTextFormat = applyTextFormat;
    window.applyTextAlignment = applyTextAlignment;
    window.createUnorderedList = createUnorderedList;
    window.createOrderedList = createOrderedList;
    window.applyIndent = applyIndent;
    window.removeIndent = removeIndent;
    window.createBlockquote = createBlockquote;
    window.applyHeading = applyHeading;
    window.applyTextColor = applyTextColor;
    window.applyBackgroundColor = applyBackgroundColor;
    window.undo = undo;
    window.redo = redo;
});