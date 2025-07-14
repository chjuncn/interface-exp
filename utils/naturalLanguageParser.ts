export interface ParsedCommand {
  action: 'change_visualization' | 'change_numbers' | 'change_speed' | 'change_layout' | 'add_feature' | 'unknown'
  parameters: {
    visualizationType?: 'columns' | 'bars' | 'circles' | 'buttons'
    heightRepresentation?: boolean
    numbers?: number[]
    speed?: number
    layout?: 'horizontal' | 'vertical' | 'grid'
    feature?: string
  }
  confidence: number
  originalText: string
}

export function parseNaturalLanguageRequest(text: string): ParsedCommand {
  const lowerText = text.toLowerCase()
  let confidence = 0
  let action: ParsedCommand['action'] = 'unknown'
  const parameters: ParsedCommand['parameters'] = {}

  // Parse visualization type changes
  if (lowerText.includes('button') || lowerText.includes('column') || lowerText.includes('bar')) {
    action = 'change_visualization'
    confidence += 0.3

    if (lowerText.includes('button')) {
      parameters.visualizationType = 'buttons'
      confidence += 0.2
    } else if (lowerText.includes('column')) {
      parameters.visualizationType = 'columns'
      confidence += 0.2
    } else if (lowerText.includes('bar')) {
      parameters.visualizationType = 'bars'
      confidence += 0.2
    }

    // Check for height representation
    if (lowerText.includes('height') || lowerText.includes('tall') || lowerText.includes('size') || lowerText.includes('represented')) {
      parameters.heightRepresentation = true
      confidence += 0.2
    }
  }

  // Special case for "buttons should be columns whose height are represented by the numbers"
  if (lowerText.includes('button') && lowerText.includes('column') && lowerText.includes('height') && lowerText.includes('represent')) {
    action = 'change_visualization'
    parameters.visualizationType = 'buttons'
    parameters.heightRepresentation = true
    confidence = 0.8 // High confidence for this specific request
  }

  // Parse number changes
  if (lowerText.includes('number') || lowerText.includes('value') || lowerText.includes('data')) {
    // Extract numbers from text
    const numberMatches = text.match(/\d+/g)
    if (numberMatches && numberMatches.length > 0) {
      action = 'change_numbers'
      parameters.numbers = numberMatches.map(n => parseInt(n))
      confidence += 0.4
    }
  }

  // Parse speed changes
  if (lowerText.includes('speed') || lowerText.includes('fast') || lowerText.includes('slow')) {
    action = 'change_speed'
    confidence += 0.3

    if (lowerText.includes('fast') || lowerText.includes('faster')) {
      parameters.speed = 500
      confidence += 0.2
    } else if (lowerText.includes('slow') || lowerText.includes('slower')) {
      parameters.speed = 2000
      confidence += 0.2
    } else {
      // Try to extract specific speed value
      const speedMatch = text.match(/(\d+)\s*(ms|milliseconds?|seconds?)/i)
      if (speedMatch) {
        let speed = parseInt(speedMatch[1])
        if (speedMatch[2].toLowerCase().includes('second')) {
          speed *= 1000
        }
        parameters.speed = speed
        confidence += 0.2
      }
    }
  }

  // Parse layout changes
  if (lowerText.includes('layout') || lowerText.includes('arrange') || lowerText.includes('position')) {
    action = 'change_layout'
    confidence += 0.3

    if (lowerText.includes('vertical') || lowerText.includes('up') || lowerText.includes('down')) {
      parameters.layout = 'vertical'
      confidence += 0.2
    } else if (lowerText.includes('horizontal') || lowerText.includes('side') || lowerText.includes('left') || lowerText.includes('right')) {
      parameters.layout = 'horizontal'
      confidence += 0.2
    } else if (lowerText.includes('grid') || lowerText.includes('matrix')) {
      parameters.layout = 'grid'
      confidence += 0.2
    }
  }

  // Parse feature additions
  if (lowerText.includes('add') || lowerText.includes('include') || lowerText.includes('show')) {
    action = 'add_feature'
    confidence += 0.2

    if (lowerText.includes('color') || lowerText.includes('highlight')) {
      parameters.feature = 'color_coding'
      confidence += 0.2
    } else if (lowerText.includes('sound') || lowerText.includes('audio')) {
      parameters.feature = 'sound_effects'
      confidence += 0.2
    } else if (lowerText.includes('step') || lowerText.includes('explanation')) {
      parameters.feature = 'step_explanation'
      confidence += 0.2
    }
  }

  // If no specific action was detected, try to infer from context
  if (action === 'unknown' && confidence === 0) {
    if (lowerText.includes('change') || lowerText.includes('modify') || lowerText.includes('update')) {
      action = 'change_visualization'
      confidence = 0.1
    }
  }

  return {
    action,
    parameters,
    confidence,
    originalText: text
  }
}

export function generateResponseFromCommand(command: ParsedCommand): string {
  const { action, parameters, confidence } = command

  if (confidence < 0.3) {
    return "I'm not sure I understood your request. Could you please be more specific about what you'd like to change in the bubble sort visualization?"
  }

  switch (action) {
    case 'change_visualization':
      if (parameters.visualizationType === 'buttons' && parameters.heightRepresentation) {
        return "I'll change the visualization to show buttons as columns where the height represents the numbers. This will make it easier to see the relative sizes!"
      } else if (parameters.visualizationType === 'columns') {
        return "I'll switch the visualization to use columns instead of the current format."
      } else if (parameters.visualizationType === 'bars') {
        return "I'll change the visualization to use bars for better visual representation."
      }
      break

    case 'change_numbers':
      if (parameters.numbers && parameters.numbers.length > 0) {
        return `I'll update the numbers to: ${parameters.numbers.join(', ')}. This will give us a fresh set of data to sort!`
      }
      break

    case 'change_speed':
      if (parameters.speed) {
        const speedText = parameters.speed < 1000 ? 'faster' : 'slower'
        return `I'll adjust the animation speed to ${parameters.speed}ms for ${speedText} visualization.`
      }
      break

    case 'change_layout':
      if (parameters.layout) {
        return `I'll change the layout to ${parameters.layout} arrangement for better visualization.`
      }
      break

    case 'add_feature':
      if (parameters.feature === 'color_coding') {
        return "I'll add color coding to make it easier to track the sorting process!"
      } else if (parameters.feature === 'sound_effects') {
        return "I'll add sound effects to enhance the interactive experience!"
      } else if (parameters.feature === 'step_explanation') {
        return "I'll add detailed step-by-step explanations to help understand the algorithm better!"
      }
      break
  }

  return "I understand you want to make changes to the visualization. Let me implement those improvements for you!"
} 