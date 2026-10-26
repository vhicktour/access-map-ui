# Claude Design prompt

Source: [AI Flow UI Design Inspiration on Collect UI](https://collectui.com/designs/ai-flow-ui-design-inspiration/19701b08-8230-4df7-9d93-d01e1b3b7293).

The accompanying local recreation uses Motion through `motion/react` (the current React Motion API), shadcn/ui base-nova, and React Flow for connected, draggable nodes. The prompt below requests the same visible behavior; those implementation choices can be used to build it.

---

Create a polished, functional React component recreation of the attached dark permissions map reference. Use TypeScript, shadcn/ui, Lucide icons, and Framer Motion. Build a local interactive demo with fixture data and React state. Match the supplied visual reference closely.

The reference demonstrates a desktop interface. The dimensions, colors, and timings below are estimates or proposed implementation choices, not exact measurements from the original.

## Design intent and composition

The interface answers one question: “Who can reach your subscribers”. It shows how people and entry points connect to an API, then to a database table. One public read permission is highlighted as the issue that needs attention.

Use a full viewport, near-black canvas with a very subtle repeating dot grid. Preserve the large empty space above and around the diagram. Do not add a sidebar or navigation bar.

Place a compact page heading at the upper left, followed by “Access map for userpage.app, scanned today at 09:42” in muted text. Put a small outlined status pill at the upper right. Its initial state reads “1 open path” with a red outline and red text.

Arrange the diagram in three columns, positioned around the vertical middle:

- Left: Signup form, Charles Postiaux, and Anyone nodes stacked vertically.
- Center: the larger `/api/subscribers` permission node.
- Right: the Subscribers table node.

Keep the graph approximately 1,050–1,150 pixels wide on a 1,600-pixel desktop viewport. Connect nodes using thin SVG cubic Bézier curves behind the cards. Use small circular connection ports at card boundaries.

## Nodes and content

The Signup form node contains a file/code icon in a dark rounded square, the title “Signup form”, and “charlespostiaux.com” beneath it. Its curved connection reaches the API’s create row. Place a small outlined “255 signups” label along this edge.

The Charles Postiaux node contains a light circular avatar with “CP”, the title “Charles Postiaux”, and “Admin”. Its connection reaches the API’s middle row. Give this edge an “Everything” label.

The Anyone node contains a globe icon, “Anyone”, and “No sign-in needed”. Initially, its border and icon have a restrained red treatment. Connect it to the API’s read row using the highlighted red path.

Below Anyone, show “4 reads this week” and four compact outlined activity chips:

- DE · Today 03:12
- US · Tue 22:47
- US · Tue 22:46
- PT · Sun 14:05

The API node contains a shield icon, `/api/subscribers`, and “userpage.app”. Below its header, show three inset permission rows: `create — Anyone`, `update, delete — Admin`, and `read — Anyone`. Right-align values and chevrons. The read row initially uses a dark red background, fine red border, and pink-red text.

The Subscribers node contains a lock icon, “Subscribers”, and “2,418 rows”. Show a two-column schema list: email/text, name/text, source/text, joined/date. Connect the API’s read output to this card. This continuation is initially red.

## Visual language

Estimate these initial tokens, then tune them against the reference: canvas `#101010`, node `#171717`, row `#222222`, subtle border `#292929`, primary text `#ededed`, secondary text `#808080`, and danger accent around `#e34662`. Keep elevation almost flat, with faint shadows and quiet borders.

Use a neutral sans-serif such as Inter. Aim for roughly 16–18px node titles, 13–14px secondary text, and 11–12px edge labels. Use 16–18px card radii and 8–10px control radii. Icons should be thin and understated. Avoid decorative gradients or oversized glowing surfaces.

## Reusable architecture

Create focused components: `AccessMap`, `MapHeader`, `StatusBadge`, `ActorNode`, `ApiPermissionNode`, `PermissionRow`, `PermissionPopover`, `TableNode`, `ReadActivity`, `ConnectionEdge`, and `ZoomControls`.

Keep fixture data, permission state, node positions, edge geometry, and visual tokens in clear shared definitions. Derive status and risk styling from the saved read permission so they cannot drift apart.

Use genuine shadcn/ui primitives for buttons, badges, popovers, tooltips, and radio selection. Style those primitives to match the reference. Use custom components and SVG for the graph itself. React Flow may manage the viewport, node positions, handles, and connected edges.

## Functional interactions

Clicking the read permission opens a compact popover directly beneath the API node. Its heading is “Who can read Subscribers?” Provide three selectable options:

- Anyone — “Current · open to the internet”
- Signed-in users — “312 Userpage accounts”
- Admin — “Only you”

Separate draft selection from the saved rule. Include a full-width “Save rule” button. Saving Admin closes the popover, changes the read value to Admin, removes the warning treatment, and changes the upper-right badge to “✓ No open paths”. The former public incoming edge becomes muted gray and dashed; the outgoing table edge returns to its neutral style. Keep the historical activity visible with muted styling.

Make the operation reversible by reopening the popover and saving Anyone. Support Escape, keyboard navigation, visible focus, and focus restoration.

Allow cards to be dragged while keeping their connections attached. Prevent buttons and popover interaction from starting a drag. Add fixed bottom-right minus, percentage, and plus controls. The reference visibly changes from 100% to 116%; use a bounded zoom range as an implementation choice.

## Motion and responsive behavior

Use Framer Motion, available through `motion/react`, for popover presence and transitions between permission states. Coordinate node and viewport motion with React Flow if used. Animate tiny luminous particles along the Bézier connections: subtle white highlights on neutral edges and pink-white highlights on the public path. Keep most of each line dim.

Suggested timings are implementation choices: 140–180ms control feedback, 180–240ms popover transitions, 300ms permission-color transitions, and 2.5–4-second staggered particle travel. Avoid excessive bouncing.

Respect reduced motion by disabling traveling particles and animated zoom while retaining clear static connections and state feedback.

For mobile, implement a proposed adaptation: preserve a minimum-width diagram inside a horizontally scrollable viewport, keep controls reachable, and constrain the popover to the visible screen. Do not claim this behavior appears in the source.

## Acceptance criteria

Deliver a runnable demo with all nodes, labels, connections, and both risk states. Verify permission selection and saving, reversing the rule, dragging with attached edges, zoom, keyboard use, reduced motion, and a narrow viewport. Include desktop screenshots of the initial public state, open popover, and saved Admin state. The demo must run without accounts, credentials, or a backend.
