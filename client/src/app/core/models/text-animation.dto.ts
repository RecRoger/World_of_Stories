export interface TextAnimation {
  animation: 'bounceIn' | 'fadeInLeft' | 'fadeInRight' | 'zoomIn' | 'title',
  delay: number,
  type: 'paragraph' | 'word' | 'letter'
}