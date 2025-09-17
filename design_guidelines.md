# Atlas Marine Group Mobile App - Design Guidelines

## Design Approach
**Selected Approach**: Design System (Material Design) with industrial/utility focus
**Justification**: This is a utility-focused application for field workers requiring efficiency, reliability, and clarity in challenging environments. Material Design provides robust patterns for forms, navigation, and data organization while maintaining mobile-first principles.

## Core Design Elements

### Color Palette
**Primary Colors:**
- Light Mode: Deep Blue (210 85% 25%) for headers, primary actions
- Dark Mode: Ocean Blue (210 75% 45%) for better visibility in field conditions
- Background: Clean whites (light) / Dark grays (210 10% 15% dark)

**Accent Colors:**
- Success Green (120 60% 40%) for completed checklists and approved photos
- Warning Orange (30 80% 50%) for pending items and required actions
- Error Red (0 70% 45%) for missing requirements and validation errors

### Typography
- **Primary**: Inter or Roboto via Google Fonts CDN
- **Hierarchy**: 
  - Headers: 600 weight, 1.5rem-2rem
  - Body: 400 weight, 1rem
  - Captions: 400 weight, 0.875rem
- **Mobile Optimization**: Minimum 16px base for field readability

### Layout System
**Tailwind Spacing**: Primary units of 2, 4, 6, and 8 (p-2, m-4, h-6, gap-8)
- Consistent 4-unit (1rem) grid system
- Mobile-first responsive breakpoints
- Card-based layout for project and checklist organization

### Component Library

**Core Navigation:**
- Bottom tab bar for main sections (Projects, Checklists, Camera, Profile)
- Breadcrumb navigation for deep project hierarchies
- Floating action button for quick photo capture

**Data Input & Forms:**
- Large touch targets (minimum 44px) for field use
- Checkbox lists with visual completion indicators
- File upload zones with drag-and-drop and camera integration
- Form validation with clear error states

**Content Organization:**
- Project cards with status indicators and progress bars
- Expandable checklist items with photo thumbnails
- Grid-based photo galleries with stage filtering
- Timeline view for project progression

**Feedback Systems:**
- Toast notifications for offline sync status
- Progress indicators for uploads and data processing
- Status badges for completion states (Complete, In Progress, Pending)
- Confirmation dialogs for critical actions

## Mobile-Specific Considerations

**Touch Optimization:**
- Minimum 44px touch targets with adequate spacing
- Swipe gestures for photo navigation and list actions
- Pull-to-refresh for data synchronization

**Field Usability:**
- High contrast mode option for outdoor visibility
- Large, clear typography for safety equipment compatibility
- Simplified navigation reducing cognitive load

**Offline Experience:**
- Clear offline indicators and sync status
- Local storage indicators showing cached data
- Graceful degradation when connectivity is poor

## Visual Hierarchy
- **Primary Actions**: Prominent buttons with primary brand colors
- **Secondary Actions**: Outline buttons with subtle hover states
- **Status Communication**: Color-coded badges and progress indicators
- **Content Grouping**: Card-based sections with subtle shadows and borders

## Performance Considerations
- Optimized image compression and lazy loading
- Minimal animations to preserve battery and performance
- Progressive Web App capabilities for app-like experience
- Efficient caching strategies for offline functionality

This design system prioritizes clarity, efficiency, and reliability while maintaining a professional appearance suitable for industrial field work environments.