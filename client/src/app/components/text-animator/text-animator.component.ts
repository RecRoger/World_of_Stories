import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { TextAnimation } from '@core/models/text-animation.dto';

interface AnimatedNode {
  text: string;
  isSpace: boolean;
  delay: string;
}

@Component({
  selector: 'app-text-animator',
  templateUrl: './text-animator.component.html',
  styleUrls: ['./text-animator.component.scss'],
})
export class TextAnimatorComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) text: string = '';
  @Input({ required: true }) config!: TextAnimation;

  // 1. Emitir evento al finalizar
  @Output() animationComplete = new EventEmitter<void>();

  renderNodes: AnimatedNode[] = [];
  isAnimationSkipped = false;

  private timerId: any = null;
  private readonly animationDurationMs = 400; // Debe matchear con el --duration del CSS

  ngOnInit(): void {
    if (this.text && this.config) {
      this.processText();
      this.scheduleCompletionEvent();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text'] || changes['config']) {
      this.resetAndProcess();
    }
  }

  ngOnDestroy(): void {
    this.clearActiveTimer();
  }

  private resetAndProcess(): void {
    this.clearActiveTimer();
    this.isAnimationSkipped = false;
    this.processText();
    this.scheduleCompletionEvent();
  }

  // 2. Doble clic para cortar la animación
  skipAnimation(): void {
    if (this.isAnimationSkipped) return;

    this.isAnimationSkipped = true;
    this.clearActiveTimer();

    // Emitimos de inmediato porque el texto ya es 100% visible
    this.animationComplete.emit();
  }

  private processText(): void {
    if (!this.text || !this.config || this.config.type === 'paragraph') {
      this.renderNodes = [];
      return;
    }

    const words = this.text.split(' ');
    const nodes: AnimatedNode[] = [];
    let sequenceIndex = 0;

    words.forEach((word, wordIdx) => {
      if (this.config.type === 'word') {
        nodes.push({
          text: word,
          isSpace: false,
          delay: `${sequenceIndex * this.config.delay}ms`
        });
        sequenceIndex++;
      } else if (this.config.type === 'letter') {
        word.split('').forEach((char) => {
          nodes.push({
            text: char,
            isSpace: false,
            delay: `${sequenceIndex * this.config.delay}ms`
          });
          sequenceIndex++;
        });
      }

      if (wordIdx < words.length - 1) {
        nodes.push({ text: ' ', isSpace: true, delay: '0ms' });
      }
    });

    this.renderNodes = nodes;
  }

  private scheduleCompletionEvent(): void {
    let totalDuration = this.animationDurationMs;

    if (this.config.type !== 'paragraph' && this.renderNodes.length > 0) {
      // El total es el delay del último elemento animable + la duración intrínseca del keyframe
      const totalElements = this.config.type === 'word'
        ? this.text.split(' ').length
        : this.text.replace(/ /g, '').length;

      totalDuration = ((totalElements - 1) * this.config.delay) + this.animationDurationMs;
    }

    this.timerId = setTimeout(() => {
      this.animationComplete.emit();
    }, totalDuration);
  }

  private clearActiveTimer(): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}